/**
 * Server-Enforced Source Registry and Strict Boundary
 * Only approved URLs and files are permitted to supply factual evidence.
 */

export const APPROVED_SOURCES = {
  HEALTH_DOCUMENTS: [
    {
      id: 'NAIS_SEPT_2025',
      name: 'National Adult Immunisation Schedule (NAIS) Sept 2025',
      url: 'https://isomer-user-content.by.gov.sg/18/abda18d6-75b8-4ce2-9085-58905e6e75b6/NAIS_Sept%202025.pdf',
      kind: 'Official Policy PDF',
      publisher: 'Ministry of Health Singapore (MOH)',
      effectiveDate: '2025-09-01',
      version: 'Sept 2025',
      description: 'Official clinical recommendations, schedules, age indications, medical conditions, and footnotes for adult vaccines in Singapore.'
    },
    {
      id: 'MOH_HEALTHIER_SG_VACCINES',
      name: 'MOH Healthier SG Vaccination Subsidies',
      url: 'https://www.moh.gov.sg/managing-expenses/schemes-and-subsidies/healthier-sg-vaccinations/',
      kind: 'Official Policy Web',
      publisher: 'Ministry of Health Singapore (MOH)',
      effectiveDate: '2024-07-01',
      version: 'Current Policy',
      description: 'Healthier SG vaccination subsidies: $0 co-payment for enrolled Singapore Citizens at enrolled clinic for nationally recommended NAIS vaccinations.'
    },
    {
      id: 'MOH_CHAS_SUBSIDIES',
      name: 'MOH CHAS Subsidies and Co-payment Caps',
      url: 'https://www.moh.gov.sg/managing-expenses/schemes-and-subsidies/chas/',
      kind: 'Official Policy Web',
      publisher: 'Ministry of Health Singapore (MOH)',
      effectiveDate: '2024-01-01',
      version: 'Current Policy',
      description: 'CHAS subsidy tiers (Blue, Orange, Green), Pioneer Generation, and Merdeka Generation vaccination subsidy co-payment caps at CHAS GP clinics.'
    },
    {
      id: 'CHAS_USING_MYCHAS',
      name: 'Using MyCHAS Tier Guidelines',
      url: 'https://www.chas.sg/Managing-My-CHAS/Using-MyCHAS',
      kind: 'Official Guidance Web',
      publisher: 'Community Health Assist Scheme (CHAS) Singapore',
      effectiveDate: '2024-01-01',
      version: 'Current Policy',
      description: 'Checking individual CHAS tiers and understanding subsidy coverage criteria.'
    },
    {
      id: 'HEALTHHUB_SG',
      name: 'HealthHub Singapore Portal',
      url: 'https://www.healthhub.sg',
      kind: 'Official Portal Web',
      publisher: 'Synapxe / Ministry of Health Singapore',
      effectiveDate: '2024-01-01',
      version: 'Current Portal',
      description: 'Official national digital healthcare platform for checking immunization records.'
    }
  ],
  ENVIRONMENT_APIS: [
    {
      id: 'ENV_2HR_FORECAST',
      name: '2-Hour Weather Forecast',
      url: 'https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast',
      kind: 'Live Environment API',
      publisher: 'National Environment Agency (NEA) via data.gov.sg',
      format: 'JSON v2',
      cadence: 'Every 15-30 minutes'
    },
    {
      id: 'ENV_24HR_FORECAST',
      name: '24-Hour Weather Forecast',
      url: 'https://api-open.data.gov.sg/v2/real-time/api/twenty-four-hr-forecast',
      kind: 'Live Environment API',
      publisher: 'National Environment Agency (NEA) via data.gov.sg',
      format: 'JSON v2',
      cadence: 'Daily / Twice daily'
    },
    {
      id: 'ENV_4DAY_OUTLOOK',
      name: '4-Day Weather Outlook',
      url: 'https://api-open.data.gov.sg/v2/real-time/api/four-day-outlook',
      kind: 'Live Environment API',
      publisher: 'National Environment Agency (NEA) via data.gov.sg',
      format: 'JSON v2',
      cadence: 'Daily'
    },
    {
      id: 'ENV_AIR_TEMP',
      name: 'Air Temperature Across Stations',
      url: 'https://api-open.data.gov.sg/v2/real-time/api/air-temperature',
      kind: 'Live Environment API',
      publisher: 'National Environment Agency (NEA) via data.gov.sg',
      format: 'JSON v2',
      cadence: 'Every minute'
    },
    {
      id: 'ENV_RAINFALL',
      name: 'Real-Time Rainfall Across Stations',
      url: 'https://api-open.data.gov.sg/v2/real-time/api/rainfall',
      kind: 'Live Environment API',
      publisher: 'National Environment Agency (NEA) via data.gov.sg',
      format: 'JSON v2',
      cadence: 'Every 5 minutes'
    },
    {
      id: 'ENV_PSI',
      name: 'Pollutant Standards Index (PSI)',
      url: 'https://api-open.data.gov.sg/v2/real-time/api/psi',
      kind: 'Live Environment API',
      publisher: 'National Environment Agency (NEA) via data.gov.sg',
      format: 'JSON v2',
      cadence: 'Hourly'
    },
    {
      id: 'ENV_PM25',
      name: '1-Hour PM2.5 Concentrations',
      url: 'https://api-open.data.gov.sg/v2/real-time/api/pm25',
      kind: 'Live Environment API',
      publisher: 'National Environment Agency (NEA) via data.gov.sg',
      format: 'JSON v2',
      cadence: 'Hourly'
    },
    {
      id: 'ENV_UV',
      name: 'Ultra-violet Index (UV)',
      url: 'https://api-open.data.gov.sg/v2/real-time/api/uv',
      kind: 'Live Environment API',
      publisher: 'National Environment Agency (NEA) via data.gov.sg',
      format: 'JSON v2',
      cadence: 'Hourly (daylight)'
    },
    {
      id: 'ENV_HUMIDITY',
      name: 'Relative Humidity',
      url: 'https://api-open.data.gov.sg/v2/real-time/api/relative-humidity',
      kind: 'Live Environment API',
      publisher: 'National Environment Agency (NEA) via data.gov.sg',
      format: 'JSON v2',
      cadence: 'Every minute'
    },
    {
      id: 'ENV_WIND',
      name: 'Wind Speed Across Stations',
      url: 'https://api-open.data.gov.sg/v2/real-time/api/wind-speed',
      kind: 'Live Environment API',
      publisher: 'National Environment Agency (NEA) via data.gov.sg',
      format: 'JSON v2',
      cadence: 'Every minute'
    }
  ],
  TRANSPORT_APIS: [
    {
      id: 'TRANS_CARPARK',
      name: 'HDB / URA Carpark Availability',
      url: 'https://api.data.gov.sg/v1/transport/carpark-availability',
      kind: 'Live Transport API',
      publisher: 'HDB & URA via data.gov.sg',
      format: 'JSON v1',
      cadence: 'Every minute'
    },
    {
      id: 'TRANS_TAXI',
      name: 'Taxi Availability Coordinates',
      url: 'https://api.data.gov.sg/v1/transport/taxi-availability',
      kind: 'Live Transport API',
      publisher: 'Land Transport Authority (LTA) via data.gov.sg',
      format: 'JSON v1',
      cadence: 'Every minute'
    }
  ],
  MCP_SERVICES: [
    {
      id: 'PUBMED_MCP',
      name: 'PubMed MCP Server (Smithery)',
      url: 'https://server.smithery.ai/pubmed',
      kind: 'Model Context Protocol Server',
      publisher: 'National Library of Medicine / Smithery.ai',
      description: 'Peer-reviewed research retrieval tool strictly supporting patient-facing educational context and citations.'
    }
  ],
  DATASETS: [
    {
      id: 'CSV_NPHS_CHRONIC',
      name: 'Prevalence of Chronic Conditions & Health Behaviors (18-74 yrs)',
      filename: 'PrevalenceOfOverweightObesityDailySmokingHypertensionDiabetesMellitusHyperlipidaemiaSufficientTotalPhysicalActivityAndBingeDrinkingAmongResidentsAged1874Years(1).csv',
      kind: 'Population Health Survey CSV',
      publisher: 'Singapore National Population Health Survey (NPHS) via data.gov.sg',
      years: ['2007', '2010', '2013', '2017', '2019', '2020', '2021', '2022', '2023'],
      seriesCount: 27
    }
  ]
};

// Set of exact approved URLs
const EXACT_APPROVED_URLS = new Set([
  'https://server.smithery.ai/pubmed',
  'https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast',
  'https://api-open.data.gov.sg/v2/real-time/api/twenty-four-hr-forecast',
  'https://api-open.data.gov.sg/v2/real-time/api/four-day-outlook',
  'https://api-open.data.gov.sg/v2/real-time/api/air-temperature',
  'https://api-open.data.gov.sg/v2/real-time/api/rainfall',
  'https://api-open.data.gov.sg/v2/real-time/api/psi',
  'https://api-open.data.gov.sg/v2/real-time/api/pm25',
  'https://api-open.data.gov.sg/v2/real-time/api/uv',
  'https://api-open.data.gov.sg/v2/real-time/api/relative-humidity',
  'https://api-open.data.gov.sg/v2/real-time/api/wind-speed',
  'https://api.data.gov.sg/v1/transport/carpark-availability',
  'https://api.data.gov.sg/v1/transport/taxi-availability',
  'https://www.healthhub.sg',
  'https://www.chas.sg/Managing-My-CHAS/Using-MyCHAS',
  'https://www.moh.gov.sg/managing-expenses/schemes-and-subsidies/chas/',
  'https://www.moh.gov.sg/managing-expenses/schemes-and-subsidies/healthier-sg-vaccinations/',
  'https://isomer-user-content.by.gov.sg/18/abda18d6-75b8-4ce2-9085-58905e6e75b6/NAIS_Sept%202025.pdf'
]);

/**
 * Validates whether a target URL is strictly in the approved registry.
 */
export function isUrlApproved(url) {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url);
    // Normalize harmless trailing slash differences for root URLs
    const normalized = parsed.origin + parsed.pathname.replace(/\/$/, '');
    for (const approved of EXACT_APPROVED_URLS) {
      const appParsed = new URL(approved);
      const appNorm = appParsed.origin + appParsed.pathname.replace(/\/$/, '');
      if (normalized === appNorm) return true;
    }
    return false;
  } catch (e) {
    return false;
  }
}
