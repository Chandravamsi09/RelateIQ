/**
 * RelateIQ Enterprise CRM - Date & Time Utilities
 */

export class DateUtils {
  public static nowISO(): string {
    return new Date().toISOString();
  }

  public static addDays(date: Date | string, days: number): Date {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  }

  public static addHours(date: Date | string, hours: number): Date {
    const d = new Date(date);
    d.setTime(d.getTime() + hours * 60 * 60 * 1000);
    return d;
  }

  public static addMinutes(date: Date | string, minutes: number): Date {
    const d = new Date(date);
    d.setTime(d.getTime() + minutes * 60 * 1000);
    return d;
  }

  public static diffInMinutes(start: Date | string, end: Date | string): number {
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    return Math.round((e - s) / (1000 * 60));
  }

  public static diffInHours(start: Date | string, end: Date | string): number {
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    return Math.round((e - s) / (1000 * 60 * 60));
  }

  public static diffInDays(start: Date | string, end: Date | string): number {
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    return Math.round((e - s) / (1000 * 60 * 60 * 24));
  }

  public static isPast(date: Date | string): boolean {
    return new Date(date).getTime() < Date.now();
  }

  public static isFuture(date: Date | string): boolean {
    return new Date(date).getTime() > Date.now();
  }

  public static formatFriendly(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  public static getStartOfMonth(date: Date = new Date()): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  public static getEndOfMonth(date: Date = new Date()): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
  }

  public static getStartOfQuarter(date: Date = new Date()): Date {
    const quarter = Math.floor(date.getMonth() / 3);
    return new Date(date.getFullYear(), quarter * 3, 1);
  }

  public static getEndOfQuarter(date: Date = new Date()): Date {
    const quarter = Math.floor(date.getMonth() / 3);
    return new Date(date.getFullYear(), (quarter + 1) * 3, 0, 23, 59, 59, 999);
  }
}
