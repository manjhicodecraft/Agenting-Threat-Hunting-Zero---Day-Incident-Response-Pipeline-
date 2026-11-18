export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type ProcessStatus = 'running' | 'sleeping' | 'suspended';
export type ProcessClassification = 'trusted' | 'monitored' | 'suspicious' | 'unknown';
export type IncidentStatus = 'new' | 'triaging' | 'investigating' | 'contained' | 'resolved';
export type ActionStatus = 'pending_approval' | 'approved' | 'rejected' | 'completed';
export type ActionCategory = 'containment' | 'eradication' | 'recovery' | 'notification';

export interface SecurityEvent {
  id: string;
  timestamp: string;
  source: string;
  eventType: string;
  severity: Severity;
  host: string;
  user: string;
  description: string;
  anomalyScore: number;
  mitreTechnique: string;
}

export interface ActivityPoint {
  time: string;
  threats: number;
  critical: number;
}

export interface DashboardStats {
  totalThreats: number;
  criticalIncidents: number;
  highRiskActivities: number;
  securityScore: number;
  activity: ActivityPoint[];
  recentAlerts: SecurityEvent[];
}

export interface ProcessRecord {
  pid: number;
  name: string;
  user: string;
  cpuPercent: number;
  memoryMb: number;
  status: ProcessStatus;
  classification: ProcessClassification;
}

export interface AnomalyResult {
  id: string;
  entity: string;
  behavior: string;
  score: number;
  severity: Severity;
  detectedAt: string;
  details: string;
  indicators: string[];
  investigationId: string;
}

export interface ScanRequest {
  query: string;
  severity: Severity | 'all';
}

export interface ScanResponse {
  events: SecurityEvent[];
  anomalies: AnomalyResult[];
  scannedAt: string;
}

export interface Incident {
  id: string;
  threatType: string;
  severity: Severity;
  detectedAt: string;
  status: IncidentStatus;
  summary: string;
  affectedHosts: string[];
  investigationId: string | null;
}

export interface TimelineEntry {
  id: string;
  time: string;
  title: string;
  detail: string;
  actor: 'AI Agent' | 'Analyst';
}

export interface BehaviorFinding {
  name: string;
  mitreTechnique: string;
  confidence: number;
  description: string;
}

export interface Evidence {
  id: string;
  type: string;
  description: string;
  sha256: string;
  collectedAt: string;
}

export interface AgentLog {
  id: string;
  time: string;
  agent: string;
  level: 'info' | 'warn' | 'success';
  message: string;
}

export interface Investigation {
  id: string;
  incidentId: string;
  title: string;
  status: 'open' | 'analyzing' | 'ready';
  riskScore: number;
  summary: string;
  timeline: TimelineEntry[];
  behaviors: BehaviorFinding[];
  evidence: Evidence[];
  agentLogs: AgentLog[];
}

export interface ResponseAction {
  id: string;
  incidentId: string;
  title: string;
  rationale: string;
  category: ActionCategory;
  impact: 'low' | 'medium' | 'high';
  status: ActionStatus;
}

export interface ReportData {
  generatedAt: string;
  totals: {
    threats: number;
    incidents: number;
    resolved: number;
    meanTimeToRespondMin: number;
  };
  incidentHistory: { month: string; opened: number; resolved: number }[];
  riskDistribution: { name: Severity; value: number }[];
}
