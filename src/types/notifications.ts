export type NotificationStatus = 'pending' | 'processing' | 'sent' | 'failed';

export interface NotificationQueueItem {
  id: string;
  alert_id: string;
  user_id: string;
  email_enabled: boolean;
  whatsapp_enabled: boolean;
  status: NotificationStatus;
  attempts: number;
  last_attempt_at: string | null;
  error_message: string | null;
  response_log: string | null;
  created_at: string;
  updated_at: string;
}

export interface NotificationMetrics {
  emailsSentToday: number;
  whatsappSentToday: number;
  successRate: number;
  failedCount: number;
}
