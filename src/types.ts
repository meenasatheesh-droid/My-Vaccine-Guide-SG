/**
 * Core TypeScript definitions for My Vaccine Guide SG
 */

export type TabType = 'home' | 'guide' | 'vaccines' | 'evidence';

export type CitizenshipType = 'SC' | 'PR' | 'OTHER';
export type HealthierSgType = 'ENROLLED_AT_ENROLLED_CLINIC' | 'ENROLLED_OTHER_CLINIC' | 'NOT_ENROLLED';
export type SubsidyTierType = 'PIONEER' | 'MERDEKA' | 'CHAS_BLUE' | 'CHAS_ORANGE' | 'CHAS_GREEN' | 'NONE';

export interface VoluntaryProfile {
  age: number | null;
  citizenship: CitizenshipType | null;
  healthierSgStatus: HealthierSgType | null;
  subsidyTier: SubsidyTierType | null;
  hasChronicCondition: boolean | null;
  chronicConditions: string[];
  isImmunocompromised: boolean | null;
  isPregnant: boolean | null;
  priorPneumo: 'NEVER' | 'PCV13_ONLY' | 'PPSV23_ONLY' | 'BOTH' | 'UNKNOWN';
  fluThisSeason: boolean | null;
  shinglesDoses: number | null;
}

export interface VaccineItem {
  id: string;
  name: string;
  diseaseTarget: string;
  naisStatus: string;
  evidenceLocator: string;
  sourceId: string;
  clinicalRecommendation: string;
  scheduleAndIntervals: string;
  distinctProductNote: string;
  contraindications: string;
  subsidyEligibility: {
    healthierSg: string;
    chasGp: string;
    polyclinic: string;
  };
}

export type EvaluationState = 'MATCHES_CRITERIA' | 'DOES_NOT_MATCH' | 'INSUFFICIENT_INFO';

export interface VaccineEvaluation {
  state: EvaluationState;
  label: string;
  reason?: string;
  clinicalNotice?: string;
  subsidyNotice?: string;
  coPaymentCap?: string;
  ruleId: string;
  evidenceLocator: string;
  providerAction?: string;
}

export interface EvaluatedResult {
  vaccine: VaccineItem;
  evaluation: VaccineEvaluation;
}

export interface EnvironmentSnapshot {
  asOf: string;
  timeZone: string;
  weather: {
    forecast: string;
    area: string;
    timestamp: string | null;
    tempCelsius: string | null;
    status: string;
    sourceUrl: string;
  };
  airQuality: {
    psi24Hr: number | null;
    pm25OneHr: number | null;
    uvIndex: number | null;
    status: string;
    disclaimer: string;
  };
  transport: {
    availableTaxis: number | null;
    sampleCarparkLots: number;
    sampleCarparksAudited: number;
    status: string;
    disclaimer: string;
  };
}

export interface CsvSeriesData {
  seriesName: string;
  inputRow: number;
  latestYear: string | null;
  latestValue: number | null;
  yearsData: Record<string, { value: number | null; raw: string }>;
  sortedHistory: Array<{ year: string; value: number | null; raw: string }>;
}

export interface DatasetPayload {
  filename: string;
  importedAt: string;
  rowCount: number;
  headers: string[];
  seriesCount: number;
  series: CsvSeriesData[];
  noteOnUnits: string;
}

export interface HealthReport {
  status: string;
  timestamp: string;
  singaporeTime: string;
  MCP_PATH: string;
  SERVER_INFO: {
    appName: string;
    version: string;
    nodeVersion: string;
    uptimeSeconds: number;
    environment: string;
    timeZone: string;
    geminiConfigured: boolean;
  };
  DATASET: {
    filename: string;
    loaded: boolean;
    rows: number;
    columns: number;
    headers?: string[];
    status: string;
    error: string | null;
  };
  mcp: {
    connected: boolean;
    status: number;
    statusText: string;
    latencyMs: number;
    endpoint: string;
    timestamp: string;
    details?: any;
    error?: string;
  };
  APPROVED_WEATHER_ENVIRONMENT_APIS?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
    status: string;
    statusCode: number | null;
    latencyMs: number;
    isCached: boolean;
    lastChecked: string;
    error?: string | null;
  }>;
  APPROVED_TRANSPORT_APIS?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
    status: string;
    statusCode: number | null;
    latencyMs: number;
    isCached: boolean;
    lastChecked: string;
    error?: string | null;
  }>;
  API_SUMMARY?: {
    mcpConnected: boolean;
    datasetValidated: boolean;
    weatherApisOnline: string;
    transportApisOnline: string;
  };
}

export interface AssistantClaim {
  claimId: string;
  text: string;
  evidenceIds: string[];
  status: 'supported' | 'insufficient' | 'conflicting';
}

export interface AssistantResponse {
  answerText: string;
  claims: AssistantClaim[];
  sources: Array<{
    sourceId: string;
    title: string;
    locator: string;
  }>;
  dataAsOf: string;
  missingInformation?: string[] | null;
  limitations: string;
}
