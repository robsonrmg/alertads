export type Page = 
  | 'landing' 
  | 'login' 
  | 'register' 
  | 'dashboard' 
  | 'monitoring' 
  | 'alerts' 
  | 'settings' 
  | 'pricing';

export type Platform = 'facebook' | 'google' | 'tiktok' | 'pinterest';

export type AlertSeverity = 'critical' | 'warning' | 'info';

export interface Alert {
  id: string;
  title: string;
  accountName: string;
  platform: Platform;
  severity: AlertSeverity;
  timestamp: string;
  message: string;
  technicalReason: string;
  recommendation: string;
  status: 'active' | 'resolved' | 'acknowledged';
}

export interface AdAccount {
  id: string;
  name: string;
  platform: Platform;
  status: 'active' | 'paused' | 'error' | 'disconnected';
  activeCampaigns: number;
  spend24h: number;
  unusualActivityCount: number;
  lastSync: string;
  ownerEmail?: string;
}

export interface PlatformIntegration {
  platform: Platform;
  connected: boolean;
  accountCount: number;
  lastSync: string;
}

export interface WhatsAppConfig {
  phoneNumber: string;
  apiKey: string;
  isConnected: boolean;
  alertOnCritical: boolean;
  alertOnWarning: boolean;
  alertOnInfo: boolean;
}
