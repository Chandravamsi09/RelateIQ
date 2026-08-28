/**
 * RelateIQ Enterprise CRM - Tenant Data Transfer Objects & Validation Schemas
 * Comprehensive schema definition, sanitization rules, and runtime validators.
 */

import { UUID, ISODateString, PaginationParams } from '../../core/types/common.types';
import { ValidationError } from '../../core/errors/app-error';

export interface CreateTenantDto {
  name?: string;
  slug?: string;
  status?: string;
  tier?: string;
  maxUsers?: number;
  storageLimitMb?: number;
  customDomain?: string;
  currency?: string;
  timezone?: string;
}

export interface UpdateTenantDto {
  name?: string;
  slug?: string;
  status?: string;
  tier?: string;
  maxUsers?: number;
  storageLimitMb?: number;
  customDomain?: string;
  currency?: string;
  timezone?: string;
}

export interface TenantFilterDto extends PaginationParams {
  search?: string;
  startDate?: ISODateString;
  endDate?: ISODateString;
  name?: string;
  slug?: string;
  status?: string;
  tier?: string;
}

export class TenantValidator {
  public static validateCreate(dto: CreateTenantDto): void {
    if (!dto) {
      throw new ValidationError('Request body for Tenant cannot be empty');
    }
  }

  public static validateUpdate(id: UUID, dto: UpdateTenantDto): void {
    if (!id) {
      throw new ValidationError('Tenant ID is required for update');
    }
    if (!dto || Object.keys(dto).length === 0) {
      throw new ValidationError('Update payload must contain at least one field');
    }
  }

  public static sanitize(dto: any): any {
    if (!dto || typeof dto !== 'object') return dto;
    const sanitized: any = {};
    for (const [key, value] of Object.entries(dto)) {
      if (typeof value === 'string') {
        sanitized[key] = value.trim();
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }
}
