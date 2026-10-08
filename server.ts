/**
 * Main Express server entry point for My Vaccine Guide SG
 * Serves API routes and mounts Vite middleware in development.
 */

import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { getHealthStatus } from './api/health.js';
import { checkMcpConnection, queryPubmedMcp } from './api/mcp.js';
import { APPROVED_SOURCES } from './api/registry.js';
import { getEnvironmentSnapshot } from './api/environment.js';
import { getWeatherStatus } from './api/weather.js';
import { getTransportStatus } from './api/transport.js';
import { loadPrimaryDataset, updateDataset, SORTED_YEARS } from './api/csvParser.js';
import { NAIS_VACCINES, PUBMED_EVIDENCE_RECORDS, evaluateVaccineSuitability, getSubsidyDetermination } from './api/evidence.js';
import { processAssistantQuery } from './api/assistant.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Ensure CORS / security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  next();
});

// 1. Health Route: Reports MCP_PATH, SERVER_INFO and DATASET
app.get('/api/health', async (req: Request, res: Response) => {
  try {
    const health = await getHealthStatus();
    res.json(health);
  } catch (err: any) {
    res.status(500).json({
      status: 'error',
      error: err.message,
      MCP_PATH: 'https://server.smithery.ai/pubmed',
      SERVER_INFO: { appName: 'My Vaccine Guide SG' },
      DATASET: { status: 'error' }
    });
  }
});

// 2. PubMed MCP Connection Check
app.get('/api/mcp/check', async (req: Request, res: Response) => {
  try {
    const check = await checkMcpConnection();
    res.json(check);
  } catch (err: any) {
    res.status(500).json({ connected: false, error: err.message });
  }
});

// 3. PubMed MCP Query / Search
app.post('/api/mcp/query', async (req: Request, res: Response) => {
  const { query, limit } = req.body;
  try {
    const result = await queryPubmedMcp(query || 'vaccine adult Singapore', limit || 5);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Source Registry
app.get('/api/sources', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    registry: APPROVED_SOURCES,
    totalSources: APPROVED_SOURCES.HEALTH_DOCUMENTS.length +
      APPROVED_SOURCES.ENVIRONMENT_APIS.length +
      APPROVED_SOURCES.TRANSPORT_APIS.length +
      APPROVED_SOURCES.MCP_SERVICES.length +
      APPROVED_SOURCES.DATASETS.length
  });
});

// 5. Live Environment & Transport Snapshot
app.get('/api/environment', async (req: Request, res: Response) => {
  try {
    const snapshot = await getEnvironmentSnapshot();
    res.json(snapshot);
  } catch (err: any) {
    res.status(500).json({ error: err.message, status: 'error' });
  }
});

// 5b. Approved Weather & Environment APIs Status
app.get('/api/weather', async (req: Request, res: Response) => {
  try {
    const weather = await getWeatherStatus();
    res.json(weather);
  } catch (err: any) {
    res.status(500).json({ error: err.message, status: 'error' });
  }
});

// 5c. Approved Transport APIs Status
app.get('/api/transport', async (req: Request, res: Response) => {
  try {
    const transport = await getTransportStatus();
    res.json(transport);
  } catch (err: any) {
    res.status(500).json({ error: err.message, status: 'error' });
  }
});

// 6. Population Health CSV Dataset
app.get('/api/dataset', (req: Request, res: Response) => {
  const dataset = loadPrimaryDataset();
  if (!dataset.valid) {
    res.status(500).json({ valid: false, errors: dataset.errors });
    return;
  }
  res.json({
    valid: true,
    data: dataset.data,
    sortedYears: SORTED_YEARS
  });
});

// 7. Atomic CSV Update / Upload
app.post('/api/dataset/upload', (req: Request, res: Response) => {
  const { csvContent, filename } = req.body;
  if (!csvContent || typeof csvContent !== 'string') {
    res.status(400).json({ success: false, error: 'csvContent must be provided as text string.' });
    return;
  }

  const result = updateDataset(csvContent, filename || 'Uploaded_Replacement.csv');
  if (!result.success) {
    res.status(422).json({
      success: false,
      message: 'Validation failed; prior dataset version retained atomically.',
      errors: result.errors,
      activeVersion: result.activeVersion
    });
    return;
  }

  res.json({
    success: true,
    message: 'Dataset updated atomically and validated successfully.',
    data: result.data
  });
});

// 8. Deterministic Vaccine Schedule & Subsidy Evaluation
app.post('/api/evaluate', (req: Request, res: Response) => {
  const { profile } = req.body;
  if (!profile) {
    res.status(400).json({ error: 'Profile is required.' });
    return;
  }

  const evaluations = NAIS_VACCINES.map(vac => ({
    vaccine: vac,
    evaluation: evaluateVaccineSuitability(profile, vac.id)
  }));

  res.json({
    profileEvaluated: {
      age: profile.age,
      citizenship: profile.citizenship,
      healthierSgStatus: profile.healthierSgStatus,
      subsidyTier: profile.subsidyTier
    },
    results: evaluations,
    evaluationTimestamp: new Date().toISOString()
  });
});

// 9. Runtime Assistant
app.post('/api/assistant', async (req: Request, res: Response) => {
  const { prompt, profile } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    res.status(400).json({ error: 'Prompt string is required.' });
    return;
  }

  try {
    const result = await processAssistantQuery(prompt, profile || {});
    res.json(result);
  } catch (err: any) {
    res.status(500).json({
      error: err.message,
      success: false
    });
  }
});

// 10. Vaccines Catalogue & Evidence Reference
app.get('/api/vaccines', (req: Request, res: Response) => {
  res.json({
    vaccines: NAIS_VACCINES,
    researchRecords: PUBMED_EVIDENCE_RECORDS
  });
});

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    // Create Vite server in middleware mode
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve dist folder
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${isDev ? 'development' : 'production'} mode`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
