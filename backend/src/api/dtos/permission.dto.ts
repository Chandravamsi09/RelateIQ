/**
 * RelateIQ Enterprise CRM - Permission Data Transfer Objects & Validation Schemas
 * Comprehensive schema definition, sanitization rules, and runtime validators.
 */

import { UUID, ISODateString, PaginationParams } from '../../core/types/common.types';
import { ValidationError } from '../../core/errors/app-error';

export interface CreatePermissionDto {
  code?: string;
  module?: string;
  action?: string;
  description?: string;
}

export interface UpdatePermissionDto {
  code?: string;
  module?: string;
  action?: string;
  description?: string;
}

export interface PermissionFilterDto extends PaginationParams {
  search?: string;
  startDate?: ISODateString;
  endDate?: ISODateString;
  code?: string;
  module?: string;
  action?: string;
  description?: string;
}

export class PermissionValidator {
  public static validateCreate(dto: CreatePermissionDto): void {
    if (!dto) {
      throw new ValidationError('Request body for Permission cannot be empty');
    }
  }

  public static validateUpdate(id: UUID, dto: UpdatePermissionDto): void {
    if (!id) {
      throw new ValidationError('Permission ID is required for update');
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
