import { getMinutesFromFrequency } from '../../lib/frequencies';

/**
 * Calcula o próximo horário de verificação (ISO string) com base na frequência do monitoramento.
 * @param frequency Frequência informada (e.g. '5m', '15m', '30m', '1h', etc.)
 * @param baseDate Opcional data de referência de início. Se não informado, utiliza o horário atual.
 */
export function calculateNextCheck(frequency: string, baseDate: Date = new Date()): string {
  const minutesToAdd = getMinutesFromFrequency(frequency);
  const nextDate = new Date(baseDate.getTime() + minutesToAdd * 60 * 1000);
  return nextDate.toISOString();
}
