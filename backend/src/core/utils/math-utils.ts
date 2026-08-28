/**
 * RelateIQ Enterprise CRM - Mathematical & Statistical Utilities
 */

export class MathUtils {
  public static round(value: number, decimals: number = 2): number {
    const factor = Math.pow(10, decimals);
    return Math.round((value + Number.EPSILON) * factor) / factor;
  }

  public static clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  public static percentage(numerator: number, denominator: number, decimals: number = 2): number {
    if (denominator === 0) return 0;
    return this.round((numerator / denominator) * 100, decimals);
  }

  public static weightedAverage(items: { value: number; weight: number }[]): number {
    let totalWeight = 0;
    let totalValue = 0;
    for (const item of items) {
      totalValue += item.value * item.weight;
      totalWeight += item.weight;
    }
    if (totalWeight === 0) return 0;
    return this.round(totalValue / totalWeight, 2);
  }

  public static standardDeviation(values: number[]): number {
    if (values.length === 0) return 0;
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
    return this.round(Math.sqrt(variance), 2);
  }

  public static median(values: number[]): number {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const half = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 1) {
      return sorted[half];
    }
    return this.round((sorted[half - 1] + sorted[half]) / 2, 2);
  }
}
