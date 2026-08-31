export const VELOCITY_ENGINE_VERSION = "2.1.0";
export function calculateSalesVelocity(opps: number, avgDeal: number, winRate: number, cycleDays: number): number {
  if (cycleDays <= 0) return 0;
  return Math.round(((opps * avgDeal * (winRate / 100)) / cycleDays) * 100) / 100;
}
