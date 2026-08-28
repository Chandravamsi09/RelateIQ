const { writeFile } = require('./helper');

console.log('Building Phase 1: Scaffolding, Monorepo Setup, Toolchain, Configs, Core Foundation...');

// 1. Root package.json
writeFile('package.json', JSON.stringify({
  name: "relateiq-monorepo",
  version: "1.0.0",
  private: true,
  description: "RelateIQ - Enterprise Client Relationship Management Platform",
  workspaces: ["backend", "frontend"],
  scripts: {
    "dev:backend": "cd backend && npm run dev",
    "dev:frontend": "cd frontend && npm run dev",
    "build": "npm run build --workspaces",
    "test": "node backend/tests/runner.js",
    "lint": "npm run lint --workspaces",
    "count-loc": "node scripts/count-loc.js"
  },
  keywords: ["crm", "enterprise", "sales", "leads", "deals", "pipeline", "helpdesk", "automation"],
  author: "RelateIQ Engineering Team",
  license: "MIT"
}, null, 2));

// 2. backend package.json
writeFile('backend/package.json', JSON.stringify({
  name: "@relateiq/backend",
  version: "1.0.0",
  description: "RelateIQ Enterprise CRM Backend Service",
  main: "dist/index.js",
  scripts: {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "test": "node tests/runner.js",
    "lint": "eslint src --ext .ts"
  },
  dependencies: {
    "express": "^4.19.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "dotenv": "^16.4.5",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "zod": "^3.23.8",
    "ws": "^8.17.0",
    "uuid": "^9.0.1",
    "winston": "^3.13.0"
  },
  devDependencies: {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/jsonwebtoken": "^9.0.6",
    "@types/bcryptjs": "^2.4.6",
    "@types/node": "^20.12.12",
    "@types/ws": "^8.5.10",
    "@types/uuid": "^9.0.8",
    "typescript": "^5.4.5",
    "ts-node-dev": "^2.0.0"
  }
}, null, 2));

// 3. frontend package.json
writeFile('frontend/package.json', JSON.stringify({
  name: "@relateiq/frontend",
  version: "1.0.0",
  description: "RelateIQ Enterprise CRM Web Client",
  scripts: {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  dependencies: {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "lucide-react": "^0.378.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.3.0"
  },
  devDependencies: {
    "@types/react": "^18.3.2",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.2.11",
    "tailwindcss": "^3.4.3",
    "postcss": "^8.4.38",
    "autoprefixer": "^10.4.19",
    "typescript": "^5.4.5"
  }
}, null, 2));

// 4. tsconfigs
writeFile('backend/tsconfig.json', JSON.stringify({
  compilerOptions: {
    target: "ES2022",
    module: "CommonJS",
    moduleResolution: "node",
    outDir: "./dist",
    rootDir: "./src",
    strict: true,
    esModuleInterop: true,
    skipLibCheck: true,
    forceConsistentCasingInFileNames: true,
    experimentalDecorators: true,
    emitDecoratorMetadata: true
  },
  include: ["src/**/*", "tests/**/*"],
  exclude: ["node_modules", "dist"]
}, null, 2));

writeFile('frontend/tsconfig.json', JSON.stringify({
  compilerOptions: {
    target: "ES2020",
    useDefineForClassFields: true,
    lib: ["ES2020", "DOM", "DOM.Iterable"],
    module: "ESNext",
    skipLibCheck: true,
    moduleResolution: "bundler",
    allowImportingTsExtensions: true,
    resolveJsonModule: true,
    isolatedModules: true,
    noEmit: true,
    jsx: "react-jsx",
    strict: true,
    noUnusedLocals: true,
    noUnusedParameters: true,
    noFallthroughCasesInSwitch: true
  },
  include: ["src"]
}, null, 2));

// 5. Config files
writeFile('.gitignore', 
node_modules/
dist/
build/
.env
.env.local
.DS_Store
*.log
coverage/
.turbo/
);

writeFile('backend/.env.example', 
PORT=5000
NODE_ENV=development
JWT_SECRET=relateiq-enterprise-super-secret-key-change-in-production-2026
JWT_REFRESH_SECRET=relateiq-enterprise-refresh-secret-key-2026
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/relateiq_db?schema=public
REDIS_URL=redis://localhost:6379
ENCRYPTION_KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
LOG_LEVEL=debug
);

// 6. Core Types & Utilities
writeFile('backend/src/core/types/common.types.ts', 
/**
 * RelateIQ Enterprise CRM - Common Core Types
 */

export type UUID = string;
export type ISODateString = string;

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface FilterCondition {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'contains' | 'startsWith' | 'endsWith' | 'between';
  value: any;
}

export interface FilterGroup {
  operator: 'AND' | 'OR';
  conditions: (FilterCondition | FilterGroup)[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
    stack?: string;
  };
  metadata?: {
    timestamp: string;
    durationMs?: number;
    tenantId?: string;
    requestId?: string;
  };
}

export enum EntityStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED',
  DELETED = 'DELETED',
  SUSPENDED = 'SUSPENDED',
  PENDING = 'PENDING'
}

export enum CurrencyCode {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  CAD = 'CAD',
  AUD = 'AUD',
  JPY = 'JPY',
  INR = 'INR',
  SGD = 'SGD'
}

export interface Money {
  amount: number;
  currency: CurrencyCode;
}

export interface Address {
  streetAddress1: string;
  streetAddress2?: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
  isPrimary?: boolean;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracyMeters?: number;
}

export interface AuditMetadata {
  createdAt: ISODateString;
  createdBy: UUID;
  updatedAt: ISODateString;
  updatedBy: UUID;
  deletedAt?: ISODateString | null;
  deletedBy?: UUID | null;
  version: number;
}
);

writeFile('backend/src/core/errors/app-error.ts', 
/**
 * RelateIQ Enterprise CRM - Standardized Error Hierarchy
 */

export abstract class AppError extends Error {
  public abstract readonly statusCode: number;
  public abstract readonly errorCode: string;
  public readonly isOperational: boolean = true;
  public readonly timestamp: string;
  public readonly details?: any;

  constructor(message: string, details?: any) {
    super(message);
    this.name = this.constructor.name;
    this.timestamp = new Date().toISOString();
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  public readonly statusCode = 400;
  public readonly errorCode = 'VALIDATION_ERROR';
}

export class AuthenticationError extends AppError {
  public readonly statusCode = 401;
  public readonly errorCode = 'AUTHENTICATION_REQUIRED';
}

export class ForbiddenError extends AppError {
  public readonly statusCode = 403;
  public readonly errorCode = 'PERMISSION_DENIED';
}

export class NotFoundError extends AppError {
  public readonly statusCode = 404;
  public readonly errorCode = 'RESOURCE_NOT_FOUND';
}

export class ConflictError extends AppError {
  public readonly statusCode = 409;
  public readonly errorCode = 'RESOURCE_CONFLICT';
}

export class RateLimitError extends AppError {
  public readonly statusCode = 429;
  public readonly errorCode = 'RATE_LIMIT_EXCEEDED';
}

export class TenantIsolationError extends AppError {
  public readonly statusCode = 403;
  public readonly errorCode = 'TENANT_ISOLATION_VIOLATION';
}

export class BusinessRuleViolationError extends AppError {
  public readonly statusCode = 422;
  public readonly errorCode = 'BUSINESS_RULE_VIOLATION';
}

export class ExternalServiceError extends AppError {
  public readonly statusCode = 502;
  public readonly errorCode = 'EXTERNAL_SERVICE_FAILURE';
}

export class InternalServerError extends AppError {
  public readonly statusCode = 500;
  public readonly errorCode = 'INTERNAL_SERVER_ERROR';
}
);

writeFile('backend/src/core/security/crypto.ts', 
/**
 * RelateIQ Enterprise CRM - Cryptographic & Hashing Utilities
 */
import * as crypto from 'crypto';

export class CryptoUtil {
  private static readonly ALGORITHM = 'aes-256-gcm';
  private static readonly IV_LENGTH = 16;
  private static readonly SALT_LENGTH = 64;
  private static readonly TAG_LENGTH = 16;

  public static hashSha256(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  public static hashHmacSha256(secret: string, data: string): string {
    return crypto.createHmac('sha256', secret).update(data).digest('hex');
  }

  public static generateSecureToken(bytes: number = 32): string {
    return crypto.randomBytes(bytes).toString('hex');
  }

  public static generateUuid(): string {
    return crypto.randomUUID();
  }

  public static encrypt(plainText: string, secretKeyHex: string): { cipherText: string; iv: string; tag: string } {
    const key = Buffer.from(secretKeyHex, 'hex');
    const iv = crypto.randomBytes(this.IV_LENGTH);
    const cipher = crypto.createCipheriv(this.ALGORITHM, key, iv);
    let encrypted = cipher.update(plainText, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const tag = cipher.getAuthTag().toString('hex');
    return {
      cipherText: encrypted,
      iv: iv.toString('hex'),
      tag: tag
    };
  }

  public static decrypt(cipherText: string, ivHex: string, tagHex: string, secretKeyHex: string): string {
    const key = Buffer.from(secretKeyHex, 'hex');
    const iv = Buffer.from(ivHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');
    const decipher = crypto.createDecipheriv(this.ALGORITHM, key, iv);
    decipher.setAuthTag(tag);
    let decrypted = decipher.update(cipherText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
);

writeFile('backend/src/core/events/event-bus.ts', 
/**
 * RelateIQ Enterprise CRM - In-Process Event Bus & Message Dispatcher
 */
export type EventHandler<T = any> = (event: DomainEvent<T>) => Promise<void> | void;

export interface DomainEvent<T = any> {
  id: string;
  name: string;
  tenantId: string;
  aggregateId: string;
  aggregateType: string;
  timestamp: string;
  version: number;
  payload: T;
  metadata?: {
    actorId?: string;
    correlationId?: string;
    sourceIp?: string;
  };
}

export class EventBus {
  private static instance: EventBus;
  private handlers: Map<string, EventHandler[]> = new Map();
  private globalHandlers: EventHandler[] = [];
  private eventHistory: DomainEvent[] = [];
  private maxHistory: number = 1000;

  private constructor() {}

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public subscribe<T = any>(eventName: string, handler: EventHandler<T>): () => void {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, []);
    }
    this.handlers.get(eventName)!.push(handler);
    return () => {
      const list = this.handlers.get(eventName) || [];
      this.handlers.set(eventName, list.filter(h => h !== handler));
    };
  }

  public subscribeAll(handler: EventHandler): () => void {
    this.globalHandlers.push(handler);
    return () => {
      this.globalHandlers = this.globalHandlers.filter(h => h !== handler);
    };
  }

  public async publish<T = any>(event: DomainEvent<T>): Promise<void> {
    this.eventHistory.push(event);
    if (this.eventHistory.length > this.maxHistory) {
      this.eventHistory.shift();
    }

    const specificHandlers = this.handlers.get(event.name) || [];
    const allHandlers = [...specificHandlers, ...this.globalHandlers];

    const promises = allHandlers.map(handler => {
      try {
        return Promise.resolve(handler(event));
      } catch (err) {
        console.error(\Error executing event handler for \:\, err);
        return Promise.resolve();
      }
    });

    await Promise.all(promises);
  }

  public getRecentEvents(limit: number = 50): DomainEvent[] {
    return this.eventHistory.slice(-limit);
  }

  public clearHandlers(): void {
    this.handlers.clear();
    this.globalHandlers = [];
  }
}
);

writeFile('backend/src/core/logger/logger.ts', 
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
    const ctx = context ? \[\]\ : '';
    const metaStr = meta ? ' ' + JSON.stringify(meta) : '';
    return \[\] [\] \ \\\;
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
);

console.log('Phase 1 files generated successfully!');
