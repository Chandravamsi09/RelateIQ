/**
 * RelateIQ Enterprise CRM - SLAConfig Data Transfer Objects & Validation Schemas
 * Comprehensive schema definition, sanitization rules, and runtime validators.
 */

import { UUID, ISODateString, PaginationParams } from '../../core/types/common.types';
import { ValidationError } from '../../core/errors/app-error';

export interface CreateSLAConfigDto {
  name?: string;
  priority?: string;
  firstResponseHours?: number;
  resolutionHours?: number;
  escalationEmail?: string;
}

export interface UpdateSLAConfigDto {
  name?: string;
  priority?: string;
  firstResponseHours?: number;
  resolutionHours?: number;
  escalationEmail?: string;
}

export interface SLAConfigFilterDto extends PaginationParams {
  search?: string;
  startDate?: ISODateString;
  endDate?: ISODateString;
  name?: string;
  priority?: string;
  firstResponseHours?: number;
  resolutionHours?: number;
}

export class SLAConfigValidator {
  public static validateCreate(dto: CreateSLAConfigDto): void {
    if (!dto) {
      throw new ValidationError('Request body for SLAConfig cannot be empty');
    }
  }

  public static validateUpdate(id: UUID, dto: UpdateSLAConfigDto): void {
    if (!id) {
      throw new ValidationError('SLAConfig ID is required for update');
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
