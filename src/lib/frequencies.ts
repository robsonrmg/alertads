import { MonitorFrequency } from '../types/monitoring';

export interface FrequencyConfig {
  value: MonitorFrequency;
  minutes: number;
  label: string;
}

export const SUPPORTED_FREQUENCIES: Record<MonitorFrequency, FrequencyConfig> = {
  '5m': { value: '5m', minutes: 5, label: '5 minutos' },
  '15m': { value: '15m', minutes: 15, label: '15 minutos' },
  '30m': { value: '30m', minutes: 30, label: '30 minutos' },
  '1h': { value: '1h', minutes: 60, label: '1 hora' },
  '6h': { value: '6h', minutes: 360, label: '6 horas' },
  '12h': { value: '12h', minutes: 720, label: '12 horas' },
  '24h': { value: '24h', minutes: 1440, label: '24 horas' }
};

/**
 * Retorna os minutos para uma frequência específica
 */
export function getMinutesFromFrequency(frequency: string): number {
  const normalized = frequency.trim() as MonitorFrequency;
  const config = SUPPORTED_FREQUENCIES[normalized];
  if (config) {
    return config.minutes;
  }
  
  // Handlers legados/fallbacks
  if (frequency === 'hourly') return 60;
  if (frequency === 'daily') return 1440;
  if (frequency === 'realtime') return 5; // Simula tempo real como 5 min para efeitos práticos
  
  // Padrão 1 hora
  return 60;
}

/**
 * Retorna o label amigável de uma frequência
 */
export function getFrequencyLabel(frequency: string): string {
  const normalized = frequency.trim() as MonitorFrequency;
  const config = SUPPORTED_FREQUENCIES[normalized];
  if (config) {
    return config.label;
  }
  
  if (frequency === 'hourly') return 'A cada hora';
  if (frequency === 'daily') return 'Uma vez ao dia';
  if (frequency === 'realtime') return 'Tempo real';
  
  return frequency;
}
