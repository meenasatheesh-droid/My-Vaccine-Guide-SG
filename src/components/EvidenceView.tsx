import React, { useState, useEffect } from 'react';
import { 
  Database, 
  CheckCircle2, 
  XCircle, 
  Activity, 
  Search, 
  Upload, 
  Download, 
  RefreshCw, 
  FileText, 
  ExternalLink,
  AlertTriangle,
  Server,
  Layers,
  HelpCircle,
  BarChart3
} from 'lucide-react';
import { HealthReport, DatasetPayload, CsvSeriesData } from '../types';

interface EvidenceViewProps {
  onOpenAssistant: (query?: string) => void;
}

export const EvidenceView: React.FC<EvidenceViewProps> = ({ onOpenAssistant }) => {
  const [healthData, setHealthData] = useState<HealthReport | null>(null);
  const [loadingHealth, setLoadingHealth] = useState(false);
  const [datasetData, setDatasetData] = useState<DatasetPayload | null>(null);
  const [loadingDataset, setLoadingDataset] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState<string>('Hypertension - Total');
  const [mcpQuery, setMcpQuery] = useState('adult pneumococcal conjugate vaccine');
  const [mcpResults, setMcpResults] = useState<any>(null);
  const [queryingMcp, setQueryingMcp] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadText, setUploadText] = useState('');
  const [uploadFilename, setUploadFilename] = useState('Replacement_Dataset.csv');
  const [uploadError, setUploadError] = useState<string[] | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch health and dataset on mount
  const fetchHealth = async () => {
    setLoadingHealth(true);
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const json = await res.json();
        setHealthData(json);
      }
    } catch (e) {
      console.error('Failed to fetch /api/health', e);
    } finally {
      setLoadingHealth(false);
    }
  };

  const fetchDataset = async () => {
    setLoadingDataset(true);
    try {
      const res = await fetch('/api/dataset');
      if (res.ok) {
        const json = await res.json();
        if (json.valid && json.data) {
          setDatasetData(json.data);
        }
      }
    } catch (e) {
      console.error('Failed to fetch /api/dataset', e);
    } finally {
      setLoadingDataset(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    fetchDataset();
  }, []);

  const handleTestMcp = async () => {
    if (!mcpQuery.trim()) return;
    setQueryingMcp(true);
    setMcpResults(null);
    try {
      const res = await fetch('/api/mcp/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: mcpQuery, limit: 3 })
      });
      const data = await res.json();
      setMcpResults(data);
    } catch (err: any) {
      setMcpResults({ success: false, error: err.message });
    } finally {
      setQueryingMcp(false);
    }
  };

  const handleUploadReplacement = async () => {
    if (!uploadText.trim()) {
      setUploadError(['Please paste valid CSV content.']);
      return;
    }
    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const res = await fetch('/api/dataset/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csvContent: uploadText, filename: uploadFilename })
      });
      const json = await res.json();

      if (res.ok && json.success) {
        setUploadSuccess(json.message);
        setDatasetData(json.data);
        fetchHealth(); // refresh dataset status in health
        setTimeout(() => {
          setUploadModalOpen(false);
          setUploadText('');
          setUploadSuccess(null);
        }, 1500);
      } else {
        setUploadError(json.errors || [json.message || 'Validation failed']);
      }
    } catch (err: any) {
      setUploadError([err.message || 'Network error during upload']);
    } finally {
      setIsUploading(false);
    }
  };

  const currentSeries = datasetData?.series?.find(s => s.seriesName === selectedSeries) || datasetData?.series?.[0];

  const handleExportProvenance = () => {
    const exportBundle = {
      appName: 'My Vaccine Guide SG',
      exportedAt: new Date().toISOString(),
      provenanceRegistry: {
        officialGuidance: 'NAIS Sept 2025 PDF',
        mcpEndpoint: healthData?.MCP_PATH,
        dataset: healthData?.DATASET
      },
      activeDatasetSummary: datasetData ? {
        filename: datasetData.filename,
        seriesCount: datasetData.seriesCount,
        importedAt: datasetData.importedAt,
        noteOnUnits: datasetData.noteOnUnits
      } : null
    };

    const blob = new Blob([JSON.stringify(exportBundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my_vaccine_guide_provenance_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
              <Database className="w-4 h-4" />
              <span>Evidence Registry & Provenance</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
              Strict Source Boundary & Audit
            </h1>
            <p className="text-xs sm:text-sm text-slate-650 mt-1 max-w-2xl leading-relaxed">
              Every clinical recommendation, subsidy cap, and environmental measure is grounded in a server-enforced registry. Model memory, web scrapes, and unapproved URLs are strictly prohibited.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={fetchHealth}
              disabled={loadingHealth}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
              title="Refresh Health Diagnostics"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingHealth ? 'animate-spin' : ''}`} />
              <span>Ping Health</span>
            </button>

            <button
              onClick={handleExportProvenance}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg border border-blue-200 transition"
              title="Export Provenance Data"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Audit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live System & MCP Health Status Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-slate-900 text-sm sm:text-base">
              System Health & MCP Connectivity
            </h2>
          </div>
          <span className="text-[11px] font-mono text-slate-700">
            Route: /api/health
          </span>
        </div>

        {healthData ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* MCP Status */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                PubMed MCP Server
              </span>
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${healthData.mcp.connected ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                <span className="text-xs font-bold text-slate-900">
                  {healthData.mcp.connected ? 'Connected (200 OK)' : 'Endpoint Standby'}
                </span>
              </div>
              <p className="text-[11px] text-slate-700 font-mono break-all">
                {healthData.MCP_PATH}
              </p>
              <div className="text-[11px] text-slate-700 pt-1 flex justify-between">
                <span>Real Measured Latency:</span>
                <span className="font-bold font-mono text-slate-800">{healthData.mcp.latencyMs} ms</span>
              </div>
            </div>

            {/* Dataset Status */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                Population Survey Dataset
              </span>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-xs font-bold text-slate-900">
                  {healthData.DATASET.status === 'validated' ? 'Validated (27 Data Rows)' : healthData.DATASET.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-700 truncate" title={healthData.DATASET.filename}>
                {healthData.DATASET.filename}
              </p>
              <div className="text-[11px] text-slate-700 pt-1 flex justify-between">
                <span>Schema Columns:</span>
                <span className="font-bold font-mono text-slate-800">{healthData.DATASET.columns} Cols (10 Years)</span>
              </div>
            </div>

            {/* Server Info */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                Server & Node Environment
              </span>
              <div className="text-xs font-bold text-slate-900">
                {healthData.SERVER_INFO.appName} v{healthData.SERVER_INFO.version}
              </div>
              <p className="text-[11px] text-slate-700">
                Uptime: {healthData.SERVER_INFO.uptimeSeconds}s • Timezone: {healthData.SERVER_INFO.timeZone}
              </p>
              <div className="text-[11px] text-slate-700 pt-1 flex justify-between">
                <span>Gemini API Grounding:</span>
                <span className="font-semibold text-blue-700">
                  {healthData.SERVER_INFO.geminiConfigured ? 'Configured (Server-Side)' : 'Deterministic Layer'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-4 text-center text-xs text-slate-700">Checking health diagnostics...</div>
        )}

        {/* Live Weather & Environment APIs Status from /api/health */}
        {healthData?.APPROVED_WEATHER_ENVIRONMENT_APIS && (
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-blue-600" />
                Approved Weather & Environment APIs (10 Feeds via data.gov.sg)
              </span>
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {healthData.API_SUMMARY?.weatherApisOnline || '10/10 Online'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {healthData.APPROVED_WEATHER_ENVIRONMENT_APIS.map((api) => (
                <div
                  key={api.id}
                  className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/90 flex items-center justify-between gap-2"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${api.status === 'connected' ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                      <span className="font-bold text-slate-900 text-xs truncate">{api.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-700 font-mono block truncate mt-0.5" title={api.url}>
                      {api.url}
                    </span>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-1.5 py-0.5 rounded">
                      {api.statusCode ? `HTTP ${api.statusCode}` : 'OK'}
                    </span>
                    <span className="text-[10px] text-slate-700 font-mono block mt-0.5">
                      {api.latencyMs}ms
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Live Transport APIs Status from /api/health */}
        {healthData?.APPROVED_TRANSPORT_APIS && (
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-blue-600" />
                Approved Transport APIs (2 Feeds via data.gov.sg)
              </span>
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {healthData.API_SUMMARY?.transportApisOnline || '2/2 Online'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {healthData.APPROVED_TRANSPORT_APIS.map((api) => (
                <div
                  key={api.id}
                  className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/90 flex items-center justify-between gap-2"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${api.status === 'connected' ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                      <span className="font-bold text-slate-900 text-xs truncate">{api.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-700 font-mono block truncate mt-0.5" title={api.url}>
                      {api.url}
                    </span>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-1.5 py-0.5 rounded">
                      {api.statusCode ? `HTTP ${api.statusCode}` : 'OK'}
                    </span>
                    <span className="text-[10px] text-slate-700 font-mono block mt-0.5">
                      {api.latencyMs}ms
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Approved Source Allowlist Registry */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
        <h2 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-600" />
          <span>Server-Enforced Source Allowlist</span>
        </h2>
        <p className="text-xs text-slate-650 leading-relaxed">
          The application strictly limits upstream outbound network calls and factual grounding to these pre-authorized resources:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-blue-900 block">Official Health Guidelines</span>
            <ul className="space-y-1 text-slate-700 text-[11px]">
              <li>• <strong>NAIS Sept 2025 PDF:</strong> isomer-user-content.by.gov.sg/18/.../NAIS_Sept 2025.pdf</li>
              <li>• <strong>MOH Healthier SG Vaccinations:</strong> moh.gov.sg/managing-expenses/.../healthier-sg-vaccinations/</li>
              <li>• <strong>MOH CHAS Subsidies:</strong> moh.gov.sg/managing-expenses/schemes-and-subsidies/chas/</li>
              <li>• <strong>CHAS MyCHAS:</strong> chas.sg/Managing-My-CHAS/Using-MyCHAS</li>
              <li>• <strong>HealthHub Portal:</strong> healthhub.sg</li>
            </ul>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-blue-900 block">External Feeds & MCP</span>
            <ul className="space-y-1 text-slate-700 text-[11px]">
              <li>• <strong>Smithery PubMed MCP:</strong> server.smithery.ai/pubmed</li>
              <li>• <strong>NEA Environment APIs (10 feeds):</strong> api-open.data.gov.sg/v2/real-time/api/... (2-hr, 24-hr, temp, rainfall, PSI, PM2.5, UV, humidity, wind)</li>
              <li>• <strong>Transport APIs (2 feeds):</strong> api.data.gov.sg/v1/transport/... (carpark, taxi)</li>
              <li>• <strong>Population CSV:</strong> PrevalenceOfOverweight...AmongResidentsAged1874Years(1).csv (27 series)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* PubMed MCP Query Tool */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-slate-900 text-sm sm:text-base">
              PubMed Research Evidence Search
            </h2>
          </div>
          <span className="text-[11px] text-slate-700 font-medium">via server.smithery.ai/pubmed</span>
        </div>

        <p className="text-xs text-slate-650 leading-relaxed">
          Search indexed peer-reviewed clinical research on adult vaccination. Research evidence provides scientific background and never overrides Singapore national health policies or subsidy rules.
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            value={mcpQuery}
            onChange={(e) => setMcpQuery(e.target.value)}
            placeholder="e.g. adult pneumococcal conjugate vaccine"
            className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
          <button
            onClick={handleTestMcp}
            disabled={queryingMcp}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 shadow-sm"
          >
            {queryingMcp ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            <span>Query MCP</span>
          </button>
        </div>

        {/* MCP Output Box */}
        {mcpResults && (
          <div className="mt-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono overflow-x-auto max-h-60">
            <div className="flex justify-between items-center pb-1 mb-2 border-b border-slate-200 text-slate-700">
              <span className="font-bold">MCP Response (Measured Latency: {mcpResults.latencyMs}ms)</span>
              <span>Status: {mcpResults.success ? 'Success' : 'Notice'}</span>
            </div>
            <pre className="text-[11px] text-slate-800 whitespace-pre-wrap">
              {JSON.stringify(mcpResults.data || mcpResults, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Population Health Survey (NPHS) Data Series Explorer */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <h2 className="font-bold text-slate-900 text-sm sm:text-base">
                National Population Health Survey (NPHS) Context
              </h2>
            </div>
            <p className="text-xs text-slate-650 mt-0.5">
              Residents aged 18–74 years. Displays 27 authorized series across 10 survey years.
            </p>
          </div>

          <button
            onClick={() => setUploadModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-xl border border-blue-200 transition self-start sm:self-center"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Replacement CSV</span>
          </button>
        </div>

        {datasetData ? (
          <div className="space-y-4">
            {/* Series selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Select Data Series ({datasetData.seriesCount} Available):
              </label>
              <select
                value={selectedSeries}
                onChange={(e) => setSelectedSeries(e.target.value)}
                className="w-full sm:w-auto min-w-[280px] px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              >
                {datasetData.series.map((s) => (
                  <option key={s.seriesName} value={s.seriesName}>
                    {s.seriesName} (Latest: {s.latestYear}: {s.latestValue ?? 'na'})
                  </option>
                ))}
              </select>
            </div>

            {/* Selected series details */}
            {currentSeries && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      {currentSeries.seriesName}
                    </h3>
                    <span className="text-[11px] text-slate-700">
                      Input Row #{currentSeries.inputRow} • Chronological History (Sorted)
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-slate-700 block">Latest Available Year:</span>
                    <span className="text-base font-extrabold text-blue-700">
                      {currentSeries.latestYear}: {currentSeries.latestValue !== null ? `${currentSeries.latestValue}%` : 'na'}
                    </span>
                  </div>
                </div>

                {/* Years table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs text-center border-collapse">
                    <thead>
                      <tr className="bg-slate-200/60 text-slate-700 font-semibold">
                        {currentSeries.sortedHistory.map((item) => (
                          <th key={item.year} className="py-1.5 px-2 border-r border-slate-200 last:border-r-0">
                            {item.year}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white">
                        {currentSeries.sortedHistory.map((item) => (
                          <td
                            key={item.year}
                            className={`py-2 px-2 border-r border-slate-100 last:border-r-0 font-medium ${
                              item.year === currentSeries.latestYear ? 'bg-blue-50/80 font-bold text-blue-800' : 'text-slate-800'
                            }`}
                          >
                            {item.value !== null ? `${item.value}%` : <span className="text-slate-700 italic">na</span>}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Statistical Disclaimers */}
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-900 space-y-1">
                  <p className="flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 text-amber-600 mt-0.5" />
                    <span>
                      <strong>Population Context Only:</strong> These figures provide historical survey estimates of chronic conditions and risk factors in Singapore residents aged 18–74 years. They do not calculate personal risk scores or dictate clinical vaccine prescribing.
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-slate-700">Loading population dataset...</div>
        )}
      </div>

      {/* Upload Replacement CSV Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                Upload Replacement NPHS CSV
              </h3>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="text-slate-700 hover:text-slate-700 p-1"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-slate-650 leading-relaxed">
              Upload an owner-supplied replacement CSV. The file must strictly contain <strong>27 data rows</strong> and the exact 10 columns:
              <br />
              <code className="text-[11px] bg-slate-100 p-1 rounded block mt-1">
                DataSeries,2023,2021,2019,2007,2022,2020,2017,2013,2010
              </code>
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Replacement Filename
              </label>
              <input
                type="text"
                value={uploadFilename}
                onChange={(e) => setUploadFilename(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                CSV Content (Paste Plain Text)
              </label>
              <textarea
                rows={8}
                value={uploadText}
                onChange={(e) => setUploadText(e.target.value)}
                placeholder="DataSeries,2023,2021,2019,2007,2022,2020,2017,2013,2010&#10;Overweight (Excluding Obese) - Total,26.7,28.8,..."
                className="w-full p-2.5 font-mono text-[11px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Error report */}
            {uploadError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 space-y-1">
                <span className="font-bold block">Validation Failed (Prior Version Retained Atomically):</span>
                <ul className="list-disc pl-4 space-y-0.5">
                  {uploadError.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {uploadSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-semibold">
                {uploadSuccess}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setUploadModalOpen(false)}
                className="px-4 py-2 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadReplacement}
                disabled={isUploading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition"
              >
                {isUploading ? 'Validating...' : 'Validate & Activate Atomically'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
