/**
 * RelateIQ Enterprise CRM - Centralized Structured Logger
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export interface LogEntry {
  level: string;
  message: string;
  timestamp: string;
  context?: string;
  tenantId?: string;
  userId?: string;
  metadata?: any;
}

export class Logger {
  private static currentLevel: LogLevel = LogLevel.DEBUG;

  public static setLevel(level: LogLevel): void {
    this.currentLevel = level;
  }

  private static format(levelName: string, message: string, context?: string, meta?: any): string {
    const ts = new Date().toISOString();
    const ctx = context ? '[' + context + ']' : '';
    const metaStr = meta ? ' ' + JSON.stringify(meta) : '';
    return '[' + ts + '] [' + levelName.toUpperCase() + '] ' + ctx + ' ' + message + metaStr;
  }

  public static debug(message: string, context?: string, meta?: any): void {
    if (this.currentLevel <= LogLevel.DEBUG) {
      console.log(this.format('DEBUG', message, context, meta));
    }
  }

  public static info(message: string, context?: string, meta?: any): void {
    if (this.currentLevel <= LogLevel.INFO) {
      console.info(this.format('INFO', message, context, meta));
    }
  }

  public static warn(message: string, context?: string, meta?: any): void {
    if (this.currentLevel <= LogLevel.WARN) {
      console.warn(this.format('WARN', message, context, meta));
    }
  }

  public static error(message: string, context?: string, meta?: any): void {
    if (this.currentLevel <= LogLevel.ERROR) {
      console.error(this.format('ERROR', message, context, meta));
    }
  }
}
