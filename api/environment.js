/**
 * Live Environment and Transport data fetcher and health checker for approved Singapore Gov APIs
 * Preserves timestamps, regions, units, and strict source boundaries.
 */

import { isUrlApproved } from './registry.js';

// Cache store with per-endpoint TTL
const cacheStore = new Map();

export const APPROVED_WEATHER_APIS = [
  {
    id: 'two-hr-forecast',
    name: '2-Hour Weather Forecast',
    url: 'https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast',
    type: 'forecast',
    ttlMs: 15 * 60 * 1000
  },
  {
    id: 'twenty-four-hr-forecast',
    name: '24-Hour Weather Forecast',
    url: 'https://api-open.data.gov.sg/v2/real-time/api/twenty-four-hr-forecast',
    type: 'forecast',
    ttlMs: 30 * 60 * 1000
  },
  {
    id: 'four-day-outlook',
    name: '4-Day Weather Outlook',
    url: 'https://api-open.data.gov.sg/v2/real-time/api/four-day-outlook',
    type: 'forecast',
    ttlMs: 60 * 60 * 1000
  },
  {
    id: 'air-temperature',
    name: 'Air Temperature Across Stations',
    url: 'https://api-open.data.gov.sg/v2/real-time/api/air-temperature',
    type: 'sensor',
    ttlMs: 3 * 60 * 1000
  },
  {
    id: 'rainfall',
    name: 'Real-Time Rainfall Across Stations',
    url: 'https://api-open.data.gov.sg/v2/real-time/api/rainfall',
    type: 'sensor',
    ttlMs: 5 * 60 * 1000
  },
  {
    id: 'psi',
    name: 'Pollutant Standards Index (PSI)',
    url: 'https://api-open.data.gov.sg/v2/real-time/api/psi',
    type: 'air_quality',
    ttlMs: 15 * 60 * 1000
  },
  {
    id: 'pm25',
    name: '1-Hour PM2.5 Concentrations',
    url: 'https://api-open.data.gov.sg/v2/real-time/api/pm25',
    type: 'air_quality',
    ttlMs: 15 * 60 * 1000
  },
  {
    id: 'uv',
    name: 'Ultra-violet Index (UV)',
    url: 'https://api-open.data.gov.sg/v2/real-time/api/uv',
    type: 'environment',
    ttlMs: 15 * 60 * 1000
  },
  {
    id: 'relative-humidity',
    name: 'Relative Humidity Across Stations',
    url: 'https://api-open.data.gov.sg/v2/real-time/api/relative-humidity',
    type: 'sensor',
    ttlMs: 3 * 60 * 1000
  },
  {
    id: 'wind-speed',
    name: 'Wind Speed Across Stations',
    url: 'https://api-open.data.gov.sg/v2/real-time/api/wind-speed',
    type: 'sensor',
    ttlMs: 3 * 60 * 1000
  }
];

export const APPROVED_TRANSPORT_APIS = [
  {
    id: 'carpark-availability',
    name: 'Carpark Availability (HDB & URA)',
    url: 'https://api.data.gov.sg/v1/transport/carpark-availability',
    type: 'transport',
    ttlMs: 2 * 60 * 1000
  },
  {
    id: 'taxi-availability',
    name: 'Taxi Availability Coordinates (LTA)',
    url: 'https://api.data.gov.sg/v1/transport/taxi-availability',
    type: 'transport',
    ttlMs: 2 * 60 * 1000
  }
];

/**
 * Fetch from an approved endpoint with caching and timeout
 */
export async function fetchFromApprovedEndpoint(url, ttl = 300000) {
  if (!isUrlApproved(url)) {
    throw new Error(`Forbidden: URL ${url} is not in the approved source registry.`);
  }

  const cached = cacheStore.get(url);
  const now = Date.now();
  if (cached && now - cached.timestamp < ttl) {
    return {
      ...cached.data,
      isCached: true,
      cacheAgeSeconds: Math.floor((now - cached.timestamp) / 1000)
    };
  }

  const startTime = Date.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' }
    });
    clearTimeout(timeout);
    const latencyMs = Date.now() - startTime;

    if (!res.ok) {
      if (cached) {
        return {
          ...cached.data,
          isStale: true,
          statusText: `Upstream HTTP ${res.status}, returning stale cache`
        };
      }
      return {
        status: 'error',
        statusCode: res.status,
        latencyMs,
        url,
        retrievedAt: new Date().toISOString()
      };
    }

    const json = await res.json();
    const entry = {
      status: 'ready',
      statusCode: res.status,
      latencyMs,
      retrievedAt: new Date().toISOString(),
      url,
      payload: json
    };

    cacheStore.set(url, { data: entry, timestamp: now });
    return entry;
  } catch (err) {
    const latencyMs = Date.now() - startTime;
    if (cached) {
      return {
        ...cached.data,
        isStale: true,
        error: err.message
      };
    }
    return {
      status: 'error',
      error: err.message,
      latencyMs,
      url,
      retrievedAt: new Date().toISOString()
    };
  }
}

/**
 * Health check handler that evaluates all 10 Weather/Environment APIs and 2 Transport APIs
 */
export async function checkAllApprovedApisHealth() {
  const checkSingleApi = async (api) => {
    const startTime = Date.now();
    try {
      const result = await fetchFromApprovedEndpoint(api.url, api.ttlMs);
      return {
        id: api.id,
        name: api.name,
        url: api.url,
        type: api.type,
        status: result.status === 'ready' ? 'connected' : result.status,
        statusCode: result.statusCode || (result.status === 'ready' ? 200 : null),
        latencyMs: result.latencyMs || (Date.now() - startTime),
        isCached: Boolean(result.isCached),
        lastChecked: result.retrievedAt || new Date().toISOString(),
        error: result.error || null
      };
    } catch (err) {
      return {
        id: api.id,
        name: api.name,
        url: api.url,
        type: api.type,
        status: 'error',
        statusCode: null,
        latencyMs: Date.now() - startTime,
        lastChecked: new Date().toISOString(),
        error: err.message
      };
    }
  };

  const weatherChecks = await Promise.all(APPROVED_WEATHER_APIS.map(checkSingleApi));
  const transportChecks = await Promise.all(APPROVED_TRANSPORT_APIS.map(checkSingleApi));

  return {
    weatherApis: weatherChecks,
    transportApis: transportChecks,
    summary: {
      totalWeatherApis: weatherChecks.length,
      weatherConnected: weatherChecks.filter(c => c.status === 'connected').length,
      totalTransportApis: transportChecks.length,
      transportConnected: transportChecks.filter(c => c.status === 'connected').length,
      allHealthy: weatherChecks.every(c => c.status === 'connected') && transportChecks.every(c => c.status === 'connected')
    }
  };
}

/**
 * Returns aggregated context snapshot for Home Screen UI with parsed fields
 */
export async function getEnvironmentSnapshot() {
  const twoHrUrl = 'https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast';
  const airTempUrl = 'https://api-open.data.gov.sg/v2/real-time/api/air-temperature';
  const psiUrl = 'https://api-open.data.gov.sg/v2/real-time/api/psi';
  const pm25Url = 'https://api-open.data.gov.sg/v2/real-time/api/pm25';
  const uvUrl = 'https://api-open.data.gov.sg/v2/real-time/api/uv';
  const humidityUrl = 'https://api-open.data.gov.sg/v2/real-time/api/relative-humidity';
  const carparkUrl = 'https://api.data.gov.sg/v1/transport/carpark-availability';
  const taxiUrl = 'https://api.data.gov.sg/v1/transport/taxi-availability';

  const [twoHr, airTemp, psi, pm25, uv, humidity, carpark, taxi] = await Promise.all([
    fetchFromApprovedEndpoint(twoHrUrl, 15 * 60 * 1000),
    fetchFromApprovedEndpoint(airTempUrl, 3 * 60 * 1000),
    fetchFromApprovedEndpoint(psiUrl, 15 * 60 * 1000),
    fetchFromApprovedEndpoint(pm25Url, 15 * 60 * 1000),
    fetchFromApprovedEndpoint(uvUrl, 15 * 60 * 1000),
    fetchFromApprovedEndpoint(humidityUrl, 3 * 60 * 1000),
    fetchFromApprovedEndpoint(carparkUrl, 2 * 60 * 1000),
    fetchFromApprovedEndpoint(taxiUrl, 2 * 60 * 1000)
  ]);

  let currentForecast = 'Fair';
  let forecastArea = 'Singapore (Island-wide)';
  let forecastTimestamp = null;
  if (twoHr?.payload?.data?.items?.[0]) {
    const item = twoHr.payload.data.items[0];
    forecastTimestamp = item.update_timestamp || item.timestamp;
    const central = item.forecasts?.find(f => f.area.toLowerCase().includes('central') || f.area.toLowerCase().includes('novena') || f.area.toLowerCase().includes('bukit'));
    if (central) {
      currentForecast = central.forecast;
      forecastArea = central.area;
    } else if (item.forecasts?.[0]) {
      currentForecast = item.forecasts[0].forecast;
      forecastArea = item.forecasts[0].area;
    }
  }

  let avgTemp = null;
  if (airTemp?.payload?.data?.items?.[0]?.readings) {
    const readings = airTemp.payload.data.items[0].readings.map(r => r.value).filter(v => typeof v === 'number');
    if (readings.length > 0) {
      avgTemp = (readings.reduce((a, b) => a + b, 0) / readings.length).toFixed(1);
    }
  }

  let psiNational = null;
  if (psi?.payload?.data?.items?.[0]?.readings?.psi_twenty_four_hourly) {
    const readings = psi.payload.data.items[0].readings.psi_twenty_four_hourly;
    psiNational = readings.national || readings.central || null;
  }

  let pm25National = null;
  if (pm25?.payload?.data?.items?.[0]?.readings?.pm25_one_hourly) {
    const readings = pm25.payload.data.items[0].readings.pm25_one_hourly;
    pm25National = readings.national || readings.central || null;
  }

  let uvIndex = null;
  if (uv?.payload?.data?.items?.[0]?.index?.[0]) {
    uvIndex = uv.payload.data.items[0].index[0].value;
  }

  let totalAvailableLots = 0;
  let sampleCarparksCount = 0;
  if (carpark?.payload?.items?.[0]?.carpark_data) {
    const cps = carpark.payload.items[0].carpark_data;
    sampleCarparksCount = cps.length;
    for (let i = 0; i < Math.min(cps.length, 100); i++) {
      const lots = cps[i].carpark_info?.[0]?.lots_available;
      if (lots) {
        totalAvailableLots += parseInt(lots, 10) || 0;
      }
    }
  }

  let taxiCount = null;
  if (taxi?.payload?.items?.[0]?.features?.[0]?.geometry?.coordinates) {
    taxiCount = taxi.payload.items[0].features[0].geometry.coordinates.length;
  }

  return {
    asOf: new Date().toISOString(),
    timeZone: 'Asia/Singapore',
    weather: {
      forecast: currentForecast,
      area: forecastArea,
      timestamp: forecastTimestamp,
      tempCelsius: avgTemp,
      status: twoHr.status || 'unknown',
      sourceUrl: twoHrUrl
    },
    airQuality: {
      psi24Hr: psiNational,
      pm25OneHr: pm25National,
      uvIndex: uvIndex,
      status: psi.status || 'unknown',
      disclaimer: 'PSI and PM2.5 are separate environmental indicators. Environmental measures do not infer clinic infection risk or individual vaccination priority.'
    },
    transport: {
      availableTaxis: taxiCount,
      sampleCarparkLots: totalAvailableLots,
      sampleCarparksAudited: sampleCarparksCount > 100 ? 100 : sampleCarparksCount,
      status: carpark.status || 'unknown',
      disclaimer: 'Carpark lot availability does not establish clinic proximity, parking charges, or vaccine availability.'
    }
  };
}
