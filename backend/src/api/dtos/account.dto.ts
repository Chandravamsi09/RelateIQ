/**
 * RelateIQ Enterprise CRM - Account Data Transfer Objects & Validation Schemas
 * Comprehensive schema definition, sanitization rules, and runtime validators.
 */

import { UUID, ISODateString, PaginationParams } from '../../core/types/common.types';
import { ValidationError } from '../../core/errors/app-error';

export interface CreateAccountDto {
  name?: string;
  industry?: string;
  website?: string;
  phone?: string;
  annualRevenue?: number;
  employeeCount?: number;
  rating?: string;
  healthScore?: number;
  billingCity?: string;
  billingCountry?: string;
}

export interface UpdateAccountDto {
  name?: string;
  industry?: string;
  website?: string;
  phone?: string;
  annualRevenue?: number;
  employeeCount?: number;
  rating?: string;
  healthScore?: number;
  billingCity?: string;
  billingCountry?: string;
}

export interface AccountFilterDto extends PaginationParams {
  search?: string;
  startDate?: ISODateString;
  endDate?: ISODateString;
  name?: string;
  industry?: string;
  website?: string;
  phone?: string;
}

export class AccountValidator {
  public static validateCreate(dto: CreateAccountDto): void {
    if (!dto) {
      throw new ValidationError('Request body for Account cannot be empty');
    }
  }

  public static validateUpdate(id: UUID, dto: UpdateAccountDto): void {
    if (!id) {
      throw new ValidationError('Account ID is required for update');
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
