/**
 * RelateIQ Enterprise CRM - Role Data Transfer Objects & Validation Schemas
 * Comprehensive schema definition, sanitization rules, and runtime validators.
 */

import { UUID, ISODateString, PaginationParams } from '../../core/types/common.types';
import { ValidationError } from '../../core/errors/app-error';

export interface CreateRoleDto {
  name?: string;
  description?: string;
  isSystem?: boolean;
  permissions?: string[];
}

export interface UpdateRoleDto {
  name?: string;
  description?: string;
  isSystem?: boolean;
  permissions?: string[];
}

export interface RoleFilterDto extends PaginationParams {
  search?: string;
  startDate?: ISODateString;
  endDate?: ISODateString;
  name?: string;
  description?: string;
  isSystem?: boolean;
  permissions?: string[];
}

export class RoleValidator {
  public static validateCreate(dto: CreateRoleDto): void {
    if (!dto) {
      throw new ValidationError('Request body for Role cannot be empty');
    }
  }

  public static validateUpdate(id: UUID, dto: UpdateRoleDto): void {
    if (!id) {
      throw new ValidationError('Role ID is required for update');
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
