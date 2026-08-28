/**
 * RelateIQ Enterprise CRM - Environment Configuration
 */

export interface AppConfig {
  port: number;
  env: string;
  jwt: {
    secret: string;
    refreshSecret: string;
    expiresIn: string;
    refreshExpiresIn: string;
  };
  database: {
    url: string;
  };
  redis: {
    url: string;
  };
  security: {
    encryptionKey: string;
    corsOrigins: string[];
    rateLimitMax: number;
    rateLimitWindowMs: number;
  };
  logging: {
    level: string;
  };
}

export const config: AppConfig = {
  port: parseInt(process.env.PORT || '5000', 10),
  env: process.env.NODE_ENV || 'development',
  jwt: {
    secret: process.env.JWT_SECRET || 'relateiq-enterprise-jwt-secret-key-2026',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'relateiq-enterprise-refresh-secret-2026',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  },
  database: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/relateiq_db?schema=public'
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  },
  security: {
    encryptionKey: process.env.ENCRYPTION_KEY || '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
    corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:5173').split(','),
    rateLimitMax: 1000,
    rateLimitWindowMs: 15 * 60 * 1000
  },
  logging: {
    level: process.env.LOG_LEVEL || 'debug'
  }
};
