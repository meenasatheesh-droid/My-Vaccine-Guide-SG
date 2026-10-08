/**
 * Approved Singapore Transport APIs
 * 
 * Sourced strictly from:
 * https://api.data.gov.sg/v1/transport/carpark-availability
 * https://api.data.gov.sg/v1/transport/taxi-availability
 */

import { fetchFromApprovedEndpoint, APPROVED_TRANSPORT_APIS } from './environment.js';

export { APPROVED_TRANSPORT_APIS };

export async function getTransportStatus() {
  const results = await Promise.all(
    APPROVED_TRANSPORT_APIS.map(async (api) => {
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
    publisher: 'Land Transport Authority (LTA) / HDB / URA',
    timeZone: 'Asia/Singapore',
    timestamp: new Date().toISOString(),
    apis: results,
    connectedCount: results.filter(r => r.status === 'ready').length,
    totalApis: results.length,
    disclaimer: 'Carpark lot availability does not establish clinic proximity, parking charges, or vaccine availability.'
  };
}

export default async function handler(req, res) {
  try {
    const status = await getTransportStatus();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(status);
  } catch (err) {
    res.status(500).json({ error: err.message, status: 'error' });
  }
}
