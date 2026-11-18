import { env } from '@/config/env';
import { request } from '@/services/api/httpClient';
import type {
  DashboardStats,
  Investigation,
  Incident,
  ProcessRecord,
  ReportData,
  ResponseAction,
  ScanRequest,
  ScanResponse,
  SecurityEvent,
} from '@/services/api/types';
import * as mock from '@/services/mock/mockApi';

export function getDashboardStats(): Promise<DashboardStats> {
  return env.useMockData ? mock.getDashboardStats() : request<DashboardStats>('/dashboard/stats');
}

export function getEvents(): Promise<SecurityEvent[]> {
  return env.useMockData ? mock.getEvents() : request<SecurityEvent[]>('/events');
}

export function getProcesses(): Promise<ProcessRecord[]> {
  return env.useMockData ? mock.getProcesses() : request<ProcessRecord[]>('/monitoring/processes');
}

export function scanThreats(payload: ScanRequest): Promise<ScanResponse> {
  return env.useMockData
    ? mock.scanThreats(payload)
    : request<ScanResponse>('/threat-hunting/scan', { method: 'POST', body: JSON.stringify(payload) });
}

export function getIncidents(): Promise<Incident[]> {
  return env.useMockData ? mock.getIncidents() : request<Incident[]>('/incidents');
}

export function getInvestigation(investigationId: string): Promise<Investigation> {
  return env.useMockData
    ? mock.getInvestigation(investigationId)
    : request<Investigation>(`/investigations/${encodeURIComponent(investigationId)}`);
}

export function analyzeInvestigation(investigationId: string): Promise<Investigation> {
  return env.useMockData
    ? mock.analyzeInvestigation(investigationId)
    : request<Investigation>(`/investigations/${encodeURIComponent(investigationId)}/analyze`, { method: 'POST' });
}

export function getResponseActions(incidentId: string): Promise<ResponseAction[]> {
  return env.useMockData
    ? mock.getResponseActions(incidentId)
    : request<ResponseAction[]>(`/incidents/${encodeURIComponent(incidentId)}/actions`);
}

export function approveIncidentAction(incidentId: string, actionId: string): Promise<ResponseAction> {
  return env.useMockData
    ? mock.approveIncidentAction(incidentId, actionId)
    : request<ResponseAction>(`/incidents/${encodeURIComponent(incidentId)}/approve`, {
        method: 'POST',
        body: JSON.stringify({ actionId }),
      });
}

export function getReports(): Promise<ReportData> {
  return env.useMockData ? mock.getReports() : request<ReportData>('/reports');
}
