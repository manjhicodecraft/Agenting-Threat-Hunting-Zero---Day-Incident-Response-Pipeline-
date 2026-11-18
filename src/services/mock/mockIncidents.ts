import type {
  AgentLog,
  BehaviorFinding,
  Evidence,
  Incident,
  Investigation,
  ReportData,
  ResponseAction,
  TimelineEntry,
} from '@/services/api/types';

const now = Date.now();
const minutesAgo = (minutes: number) => new Date(now - minutes * 60_000).toISOString();

export const mockIncidents: Incident[] = [
  {
    id: 'INC-2041',
    threatType: 'Suspected zero-day exploit chain (Office to PowerShell)',
    severity: 'critical',
    detectedAt: minutesAgo(3),
    status: 'investigating',
    summary: 'Macro-enabled document launched an encoded PowerShell stager that beaconed to an unregistered domain.',
    affectedHosts: ['FIN-WS-0142'],
    investigationId: 'INV-7101',
  },
  {
    id: 'INC-2039',
    threatType: 'Credential dumping (LSASS access)',
    severity: 'critical',
    detectedAt: minutesAgo(34),
    status: 'triaging',
    summary: 'Unsigned binary accessed LSASS memory on an HR workstation; no matching change record.',
    affectedHosts: ['HR-WS-0066'],
    investigationId: 'INV-7102',
  },
  {
    id: 'INC-2036',
    threatType: 'Security agent tampering',
    severity: 'high',
    detectedAt: minutesAgo(210),
    status: 'contained',
    summary: 'Attempt to stop the endpoint protection service was blocked by tamper protection.',
    affectedHosts: ['SALES-WS-0023'],
    investigationId: 'INV-7103',
  },
  {
    id: 'INC-2033',
    threatType: 'Account takeover (impossible travel)',
    severity: 'high',
    detectedAt: minutesAgo(640),
    status: 'new',
    summary: 'Sign-ins from two distant regions followed by a forwarding rule on the mailbox.',
    affectedHosts: ['VPN-GW-02'],
    investigationId: 'INV-7105',
  },
  {
    id: 'INC-2044',
    threatType: 'DNS tunneling from service account',
    severity: 'high',
    detectedAt: minutesAgo(19),
    status: 'new',
    summary: 'Service account generating high-entropy DNS queries to a domain registered nine days ago.',
    affectedHosts: ['DEV-LNX-17'],
    investigationId: 'INV-7104',
  },
  {
    id: 'INC-2029',
    threatType: 'Brute-force password spray',
    severity: 'medium',
    detectedAt: minutesAgo(1440),
    status: 'resolved',
    summary: 'Password spray against the HR portal blocked by adaptive throttling; no accounts compromised.',
    affectedHosts: ['HR-PORTAL'],
    investigationId: null,
  },
  {
    id: 'INC-2024',
    threatType: 'Data exfiltration attempt (cloud storage)',
    severity: 'medium',
    detectedAt: minutesAgo(2880),
    status: 'resolved',
    summary: 'Bulk download from finance archive reviewed with the data owner; access was legitimate.',
    affectedHosts: ['S3-PROD-ARCHIVE'],
    investigationId: null,
  },
];

const timeline = (entries: Omit<TimelineEntry, 'id'>[]): TimelineEntry[] =>
  entries.map((entry, index) => ({ ...entry, id: `TL-${index + 1}` }));

const evidence = (items: Omit<Evidence, 'id'>[]): Evidence[] =>
  items.map((item, index) => ({ ...item, id: `EV-${index + 1}` }));

const logs = (entries: Omit<AgentLog, 'id'>[]): AgentLog[] =>
  entries.map((entry, index) => ({ ...entry, id: `LOG-${index + 1}` }));

const behaviors: BehaviorFinding[] = [
  {
    name: 'Malicious macro execution',
    mitreTechnique: 'T1204.002',
    confidence: 0.94,
    description: 'Word spawned PowerShell with a hidden window and an encoded command line.',
  },
  {
    name: 'Command and control beaconing',
    mitreTechnique: 'T1071.001',
    confidence: 0.89,
    description: 'Periodic HTTPS requests at a 60-second interval with jitter under 5 percent.',
  },
  {
    name: 'Defense evasion via AMSI bypass',
    mitreTechnique: 'T1562.001',
    confidence: 0.81,
    description: 'Memory patch pattern matching a known AMSI bypass routine was observed.',
  },
];

const baseInvestigations: Investigation[] = [
  {
    id: 'INV-7101',
    incidentId: 'INC-2041',
    title: 'Encoded PowerShell from macro on FIN-WS-0142',
    status: 'ready',
    riskScore: 92,
    summary:
      'The agent assesses a likely targeted intrusion using a macro-based loader. Execution is contained to one workstation, but the beacon destination is new and warrants immediate containment review.',
    timeline: timeline([
      { time: minutesAgo(3), actor: 'AI Agent', title: 'Anomaly raised', detail: 'Parent-child chain deviates from baseline (score 96).' },
      { time: minutesAgo(2), actor: 'AI Agent', title: 'Payload decoded', detail: 'Base64 command decoded into a download-and-execute stager.' },
      { time: minutesAgo(1), actor: 'AI Agent', title: 'Network correlation', detail: 'Same destination observed on two other endpoints in the last 72 hours.' },
      { time: minutesAgo(0.5), actor: 'Analyst', title: 'Review requested', detail: 'Awaiting analyst confirmation before any containment step.' },
    ]),
    behaviors,
    evidence: evidence([
      { type: 'Process tree', description: 'winword.exe > powershell.exe (encoded)', sha256: '9f2c1a7be03d48f5a1e6c0d2b7f49a8e5c3d1b0a9e8f7c6d5b4a3928170f6e2d', collectedAt: minutesAgo(3) },
      { type: 'Memory image', description: 'powershell.exe working set (14 MB)', sha256: '3ab81f0e6c2d9a47b5e8f1c0d3a6b92e7f4c8d1a0b5e2f9c6d3a8b7e4f1c0d9a', collectedAt: minutesAgo(2) },
      { type: 'Network capture', description: 'TLS flow metadata, 214 packets', sha256: '77d0c3e91a5b2f84d6c0e7a9b1f3d5c8e2a4b6d0f8c1e3a5b7d9f2c4e6a8b0d1', collectedAt: minutesAgo(2) },
    ]),
    agentLogs: logs([
      { time: minutesAgo(3), agent: 'Triage Agent', level: 'warn', message: 'Anomaly score 96 exceeds the critical threshold of 90.' },
      { time: minutesAgo(2), agent: 'Malware Analysis Agent', level: 'info', message: 'Decoded payload statically. No execution performed; sample held in quarantine.' },
      { time: minutesAgo(1), agent: 'Threat Intel Agent', level: 'success', message: 'Correlated destination with 2 related endpoints.' },
      { time: minutesAgo(0.5), agent: 'Response Planner', level: 'info', message: 'Drafted 3 containment options. Awaiting analyst approval.' },
    ]),
  },
  {
    id: 'INV-7102',
    incidentId: 'INC-2039',
    title: 'LSASS access from unsigned binary on HR-WS-0066',
    status: 'analyzing',
    riskScore: 87,
    summary:
      'Credential access is likely. Analysis is still gathering process lineage and authentication logs for the affected user.',
    timeline: timeline([
      { time: minutesAgo(34), actor: 'AI Agent', title: 'Anomaly raised', detail: 'Unsigned process requested read access to lsass.exe.' },
      { time: minutesAgo(30), actor: 'AI Agent', title: 'Lineage pending', detail: 'Collecting parent process chain from the endpoint agent.' },
    ]),
    behaviors: [behaviors[2]],
    evidence: evidence([
      { type: 'Handle table', description: 'lsass.exe PROCESS_VM_READ handle from update_helper.exe', sha256: 'c4e2a8b0d6f1e3c5a7b9d2f4e6a8c0b1d3f5e7a9c2b4d6f8e0a1c3b5d7f9e2a4', collectedAt: minutesAgo(34) },
    ]),
    agentLogs: logs([
      { time: minutesAgo(34), agent: 'Triage Agent', level: 'warn', message: 'Protected process access detected.' },
      { time: minutesAgo(30), agent: 'Endpoint Forensics Agent', level: 'info', message: 'Requested process lineage from endpoint agent.' },
    ]),
  },
  {
    id: 'INV-7103',
    incidentId: 'INC-2036',
    title: 'Tamper attempt on endpoint protection, SALES-WS-0023',
    status: 'ready',
    riskScore: 64,
    summary:
      'The attempt was blocked by tamper protection. The most likely cause is a user-initiated script run, so the agent recommends user interview before further action.',
    timeline: timeline([
      { time: minutesAgo(210), actor: 'AI Agent', title: 'Tamper attempt blocked', detail: 'Service stop request rejected by policy.' },
      { time: minutesAgo(200), actor: 'Analyst', title: 'Ticket opened', detail: 'Analyst assigned to contact the user.' },
    ]),
    behaviors: [behaviors[2]],
    evidence: evidence([
      { type: 'Policy log', description: 'Tamper protection rejection event', sha256: 'e1b3d5f7a9c2e4b6d8f0a1c3e5b7d9f2a4c6e8b0d2f4a6c8e0b1d3f5a7c9e2b4', collectedAt: minutesAgo(210) },
    ]),
    agentLogs: logs([
      { time: minutesAgo(210), agent: 'Policy Agent', level: 'success', message: 'Tamper protection blocked the request.' },
    ]),
  },
];

const extraInvestigations: Investigation[] = [
  {
    id: 'INV-7104',
    incidentId: 'INC-2044',
    title: 'DNS tunneling pattern on DEV-LNX-17',
    status: 'ready',
    riskScore: 74,
    summary:
      'Query pattern is consistent with DNS tunneling. The service account is a build runner, so a compromised pipeline step is the leading hypothesis.',
    timeline: timeline([
      { time: minutesAgo(19), actor: 'AI Agent', title: 'Anomaly raised', detail: 'Query entropy and volume exceed the service account baseline.' },
      { time: minutesAgo(15), actor: 'AI Agent', title: 'Domain reputation', detail: 'Domain registered nine days ago with no prior history.' },
    ]),
    behaviors: [
      {
        name: 'DNS tunneling',
        mitreTechnique: 'T1071.004',
        confidence: 0.86,
        description: 'Long TXT responses and high-entropy labels suggest data is encoded in DNS queries.',
      },
    ],
    evidence: evidence([
      { type: 'DNS log', description: '1,980 queries to a single apex domain in 22 minutes', sha256: 'a7d3f1c9e5b2d8a4f0e6c3b9d7a1f5e2c8b4d0a6f3e9c5b1d7a2f8e4c0b6d3a9', collectedAt: minutesAgo(19) },
    ]),
    agentLogs: logs([
      { time: minutesAgo(19), agent: 'Network Analysis Agent', level: 'warn', message: 'Sustained high-entropy DNS pattern detected.' },
      { time: minutesAgo(15), agent: 'Threat Intel Agent', level: 'info', message: 'Domain has no reputation history.' },
    ]),
  },
  {
    id: 'INV-7105',
    incidentId: 'INC-2033',
    title: 'Impossible travel and mailbox forwarding for a.okafor',
    status: 'analyzing',
    riskScore: 81,
    summary:
      'Sign-in pattern and the forwarding rule indicate possible account takeover. The mailbox rule should be reviewed before the user is contacted.',
    timeline: timeline([
      { time: minutesAgo(640), actor: 'AI Agent', title: 'Anomaly raised', detail: 'Two sign-ins from different countries within 40 minutes.' },
      { time: minutesAgo(630), actor: 'AI Agent', title: 'Mailbox rule found', detail: 'Forward-all rule created seconds after the second session.' },
    ]),
    behaviors: [behaviors[0]],
    evidence: evidence([
      { type: 'Audit log', description: 'Mailbox rule creation event with client IP', sha256: 'b6e0d2a4f8c1e7b3d9a5f0c6e2b8d4a1f7c3e9b5d0a6f2c8e4b1d7a3f9c5e0b2', collectedAt: minutesAgo(640) },
    ]),
    agentLogs: logs([
      { time: minutesAgo(640), agent: 'Identity Agent', level: 'warn', message: 'Impossible travel confirmed against two session records.' },
    ]),
  },
];

export const mockInvestigations: Investigation[] = [...baseInvestigations, ...extraInvestigations];

export const mockResponseActions: ResponseAction[] = [
  {
    id: 'ACT-1',
    incidentId: 'INC-2041',
    title: 'Isolate FIN-WS-0142 from the network',
    rationale: 'Stops the beacon and prevents lateral movement. Analyst keeps the device powered and forensic capture running.',
    category: 'containment',
    impact: 'high',
    status: 'pending_approval',
  },
  {
    id: 'ACT-2',
    incidentId: 'INC-2041',
    title: 'Block the beacon destination at the perimeter',
    rationale: 'Blocks the newly observed domain across the firewall and DNS resolver. Low operational impact.',
    category: 'containment',
    impact: 'low',
    status: 'pending_approval',
  },
  {
    id: 'ACT-3',
    incidentId: 'INC-2041',
    title: 'Force password reset for j.marlow',
    rationale: 'The credential may have been exposed during the encoded command execution.',
    category: 'eradication',
    impact: 'medium',
    status: 'pending_approval',
  },
  {
    id: 'ACT-4',
    incidentId: 'INC-2041',
    title: 'Notify the finance data owner',
    rationale: 'Required for the internal notification policy because a finance workstation is in scope.',
    category: 'notification',
    impact: 'low',
    status: 'approved',
  },
  {
    id: 'ACT-5',
    incidentId: 'INC-2039',
    title: 'Quarantine update_helper.exe on HR-WS-0066',
    rationale: 'Moves the unsigned binary to quarantine for analysis. The file is preserved and can be restored.',
    category: 'containment',
    impact: 'medium',
    status: 'pending_approval',
  },
];

export const mockReport: ReportData = {
  generatedAt: new Date().toISOString(),
  totals: { threats: 1284, incidents: 46, resolved: 39, meanTimeToRespondMin: 27 },
  incidentHistory: [
    { month: 'May', opened: 5, resolved: 4 },
    { month: 'Jun', opened: 7, resolved: 6 },
    { month: 'Jul', opened: 4, resolved: 4 },
    { month: 'Aug', opened: 9, resolved: 7 },
    { month: 'Sep', opened: 8, resolved: 9 },
    { month: 'Oct', opened: 13, resolved: 9 },
  ],
  riskDistribution: [
    { name: 'critical', value: 6 },
    { name: 'high', value: 14 },
    { name: 'medium', value: 19 },
    { name: 'low', value: 7 },
  ],
};
