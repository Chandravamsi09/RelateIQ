/**
 * RelateIQ Enterprise CRM - Pipeline Data Transfer Objects & Validation Schemas
 * Comprehensive schema definition, sanitization rules, and runtime validators.
 */

import { UUID, ISODateString, PaginationParams } from '../../core/types/common.types';
import { ValidationError } from '../../core/errors/app-error';

export interface CreatePipelineDto {
  name?: string;
  isDefault?: boolean;
  description?: string;
}

export interface UpdatePipelineDto {
  name?: string;
  isDefault?: boolean;
  description?: string;
}

export interface PipelineFilterDto extends PaginationParams {
  search?: string;
  startDate?: ISODateString;
  endDate?: ISODateString;
  name?: string;
  isDefault?: boolean;
  description?: string;
}

export class PipelineValidator {
  public static validateCreate(dto: CreatePipelineDto): void {
    if (!dto) {
      throw new ValidationError('Request body for Pipeline cannot be empty');
    }
  }

  public static validateUpdate(id: UUID, dto: UpdatePipelineDto): void {
    if (!id) {
      throw new ValidationError('Pipeline ID is required for update');
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
