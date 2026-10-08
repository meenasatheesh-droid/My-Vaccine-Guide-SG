/**
 * Health check handler for My Vaccine Guide SG
 * Reports MCP_PATH, SERVER_INFO, DATASET, APPROVED_WEATHER_ENVIRONMENT_APIS, and APPROVED_TRANSPORT_APIS
 */

import { checkMcpConnection } from './mcp.js';
import { checkAllApprovedApisHealth } from './environment.js';
import fs from 'fs';
import path from 'path';

const CSV_FILENAME = 'PrevalenceOfOverweightObesityDailySmokingHypertensionDiabetesMellitusHyperlipidaemiaSufficientTotalPhysicalActivityAndBingeDrinkingAmongResidentsAged1874Years(1).csv';

export async function getHealthStatus() {
  // Concurrently run MCP connection check and environmental/transport checks
  const [mcpConnection, envHealth] = await Promise.all([
    checkMcpConnection(),
    checkAllApprovedApisHealth()
  ]);

  let datasetStatus = {
    filename: CSV_FILENAME,
    loaded: false,
    rows: 0,
    columns: 0,
    status: 'unloaded',
    error: null
  };

  try {
    const csvPath = path.resolve(process.cwd(), CSV_FILENAME);
    if (fs.existsSync(csvPath)) {
      const content = fs.readFileSync(csvPath, 'utf8');
      const lines = content.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
      const headers = lines[0] ? lines[0].split(',') : [];
      datasetStatus = {
        filename: CSV_FILENAME,
        loaded: true,
        rows: Math.max(0, lines.length - 1),
        columns: headers.length,
        headers,
        status: lines.length - 1 === 27 ? 'validated' : 'row_count_mismatch',
        error: null
      };
    } else {
      datasetStatus.status = 'file_missing';
    }
  } catch (err) {
    datasetStatus.error = err.message;
    datasetStatus.status = 'read_error';
  }

  const sgTime = new Intl.DateTimeFormat('en-SG', {
    timeZone: 'Asia/Singapore',
    dateStyle: 'full',
    timeStyle: 'long'
  }).format(new Date());

  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    singaporeTime: sgTime,
    MCP_PATH: 'https://server.smithery.ai/pubmed',
    SERVER_INFO: {
      appName: 'My Vaccine Guide SG',
      version: '1.0.0',
      nodeVersion: process.version,
      uptimeSeconds: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || 'development',
      timeZone: 'Asia/Singapore',
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY)
    },
    DATASET: datasetStatus,
    mcp: mcpConnection,
    APPROVED_WEATHER_ENVIRONMENT_APIS: envHealth.weatherApis,
    APPROVED_TRANSPORT_APIS: envHealth.transportApis,
    API_SUMMARY: {
      mcpConnected: mcpConnection.connected,
      datasetValidated: datasetStatus.status === 'validated',
      weatherApisOnline: `${envHealth.summary.weatherConnected}/${envHealth.summary.totalWeatherApis}`,
      transportApisOnline: `${envHealth.summary.transportConnected}/${envHealth.summary.totalTransportApis}`
    }
  };
}

// Default export for Vercel serverless /api/health or Express router
export default async function handler(req, res) {
  try {
    const health = await getHealthStatus();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(health);
  } catch (err) {
    res.status(500).json({
      status: 'error',
      error: err.message,
      MCP_PATH: 'https://server.smithery.ai/pubmed',
      SERVER_INFO: { appName: 'My Vaccine Guide SG' },
      DATASET: { filename: CSV_FILENAME, loaded: false }
    });
  }
}
