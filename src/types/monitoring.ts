export type MonitorFrequency = '5m' | '15m' | '30m' | '1h' | '6h' | '12h' | '24h';

export type AlertType = 'new_ad' | 'price_change' | 'keyword_found' | 'content_changed';

export interface MonitorRecord {
  id: string;
  user_id: string;
  name: string;
  target_url: string;
  keyword: string;
  frequency: MonitorFrequency;
  email: string | null;
  whatsapp_number: string | null;
  is_active: boolean;
  last_checked_at?: string | null;
  next_check_at?: string | null;
  created_at: string;
}

export interface AlertRecord {
  id: string;
  monitor_id: string | null;
  user_id: string;
  type: AlertType;
  message: string;
  status: 'sent' | 'resolved' | 'acknowledged';
  created_at: string;
}

export interface ExecutionLog {
  id: string;
  monitor_id: string;
  status: 'success' | 'error';
  message: string;
  executed_at: string;
}
