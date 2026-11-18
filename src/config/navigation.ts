import {
  Activity,
  BarChart3,
  Bot,
  LayoutDashboard,
  Radar,
  ShieldAlert,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  description: string;
}

export const navigationItems: NavItem[] = [
  { label: 'Security Overview', path: '/', icon: LayoutDashboard, description: 'Posture and live threat activity' },
  { label: 'Live Monitoring', path: '/monitoring', icon: Activity, description: 'Process telemetry' },
  { label: 'Threat Hunting', path: '/threat-hunting', icon: Radar, description: 'Search and anomaly detection' },
  { label: 'AI Investigation', path: '/investigations', icon: Bot, description: 'Agent timelines and evidence' },
  { label: 'Incident Management', path: '/incidents', icon: ShieldAlert, description: 'Incident queue and details' },
  { label: 'Response Center', path: '/response', icon: ShieldCheck, description: 'Approval-gated actions' },
  { label: 'Reports & Analytics', path: '/reports', icon: BarChart3, description: 'Statistics and exports' },
];
