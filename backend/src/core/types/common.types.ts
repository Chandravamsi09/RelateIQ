/**
 * RelateIQ Enterprise CRM - Common Core Types
 * Defines base entities, pagination, filtering, audit, and API response contracts.
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

export interface CustomFieldDefinition {
  id: UUID;
  tenantId: UUID;
  entityType: 'ACCOUNT' | 'CONTACT' | 'LEAD' | 'DEAL' | 'TICKET';
  fieldName: string;
  fieldLabel: string;
  fieldType: 'TEXT' | 'NUMBER' | 'BOOLEAN' | 'DATE' | 'SELECT' | 'MULTI_SELECT' | 'CURRENCY' | 'URL';
  isRequired: boolean;
  defaultValue?: any;
  options?: string[];
  description?: string;
  displayOrder: number;
}

export interface CustomFieldValue {
  fieldId: UUID;
  fieldName: string;
  value: any;
}
