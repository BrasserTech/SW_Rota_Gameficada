export function distanceMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const rad = (n: number) => n * Math.PI / 180;
  const a = Math.sin(rad(lat2 - lat1) / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(rad(lon2 - lon1) / 2) ** 2;
  return 6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
export function validatePresence(distance: number, accuracy: number, radius: number, maxAccuracy: number) {
  if (accuracy > maxAccuracy) return 'Precisão do GPS insuficiente. Vá para uma área aberta e tente novamente.';
  if (distance + accuracy > radius) return 'Localização fora da área permitida do local.';
  return null;
}
export function advanceDwell(input: { startedAt: Date; lastSeenAt: Date; dwellSeconds: number; minMinutes: number; maxMinutes: number; maxGapSeconds: number }, now: Date, finish: boolean) {
  const elapsed = (now.getTime() - input.startedAt.getTime()) / 1000;
  const gap = (now.getTime() - input.lastSeenAt.getTime()) / 1000;
  const dwell = input.dwellSeconds + Math.max(0, Math.floor(gap));
  if (gap > input.maxGapSeconds) return { valid: false, dwell, reason: 'Monitoramento interrompido por tempo excessivo. Inicie uma nova visita.' };
  if (elapsed > input.maxMinutes * 60) return { valid: false, dwell, reason: 'Tempo máximo de permanência excedido.' };
  if (finish && dwell < input.minMinutes * 60) return { valid: false, dwell, reason: 'Tempo mínimo de permanência ainda não atingido.', retry: true };
  return { valid: true, dwell, reason: null };
}
