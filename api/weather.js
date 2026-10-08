/**
 * Approved Singapore Weather & Environment APIs
 * 
 * Sourced strictly from:
 * https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast
 * https://api-open.data.gov.sg/v2/real-time/api/twenty-four-hr-forecast
 * https://api-open.data.gov.sg/v2/real-time/api/four-day-outlook
 * https://api-open.data.gov.sg/v2/real-time/api/air-temperature
 * https://api-open.data.gov.sg/v2/real-time/api/rainfall
 * https://api-open.data.gov.sg/v2/real-time/api/psi
 * https://api-open.data.gov.sg/v2/real-time/api/pm25
 * https://api-open.data.gov.sg/v2/real-time/api/uv
 * https://api-open.data.gov.sg/v2/real-time/api/relative-humidity
 * https://api-open.data.gov.sg/v2/real-time/api/wind-speed
 */

import { fetchFromApprovedEndpoint, APPROVED_WEATHER_APIS } from './environment.js';

export { APPROVED_WEATHER_APIS };

export async function getWeatherStatus() {
  const results = await Promise.all(
    APPROVED_WEATHER_APIS.map(async (api) => {
      const res = await fetchFromApprovedEndpoint(api.url, api.ttlMs);
      return {
        id: api.id,
        name: api.name,
        url: api.url,
        status: res.status,
        statusCode: res.statusCode || (res.status === 'ready' ? 200 : null),
        latencyMs: res.latencyMs,
        lastUpdated: res.retrievedAt
      };
    })
  );

  return {
    source: 'data.gov.sg',
    publisher: 'National Environment Agency (NEA)',
    timeZone: 'Asia/Singapore',
    timestamp: new Date().toISOString(),
    apis: results,
    connectedCount: results.filter(r => r.status === 'ready').length,
    totalApis: results.length
  };
}

export default async function handler(req, res) {
  try {
    const status = await getWeatherStatus();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(status);
  } catch (err) {
    res.status(500).json({ error: err.message, status: 'error' });
  }
}
