/**
 * RelateIQ Enterprise CRM - AuditLog Data Transfer Objects & Validation Schemas
 * Comprehensive schema definition, sanitization rules, and runtime validators.
 */

import { UUID, ISODateString, PaginationParams } from '../../core/types/common.types';
import { ValidationError } from '../../core/errors/app-error';

export interface CreateAuditLogDto {
  userId?: string;
  action?: string;
  entityType?: string;
  entityId?: string;
  changes?: any;
  ipAddress?: string;
  userAgent?: string;
}

export interface UpdateAuditLogDto {
  userId?: string;
  action?: string;
  entityType?: string;
  entityId?: string;
  changes?: any;
  ipAddress?: string;
  userAgent?: string;
}

export interface AuditLogFilterDto extends PaginationParams {
  search?: string;
  startDate?: ISODateString;
  endDate?: ISODateString;
  userId?: string;
  action?: string;
  entityType?: string;
  entityId?: string;
}

export class AuditLogValidator {
  public static validateCreate(dto: CreateAuditLogDto): void {
    if (!dto) {
      throw new ValidationError('Request body for AuditLog cannot be empty');
    }
  }

  public static validateUpdate(id: UUID, dto: UpdateAuditLogDto): void {
    if (!id) {
      throw new ValidationError('AuditLog ID is required for update');
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
