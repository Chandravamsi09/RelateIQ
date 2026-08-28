/**
 * RelateIQ Enterprise CRM - PipelineStage Data Transfer Objects & Validation Schemas
 * Comprehensive schema definition, sanitization rules, and runtime validators.
 */

import { UUID, ISODateString, PaginationParams } from '../../core/types/common.types';
import { ValidationError } from '../../core/errors/app-error';

export interface CreatePipelineStageDto {
  pipelineId?: string;
  name?: string;
  orderIndex?: number;
  probability?: number;
  isClosedWon?: boolean;
  isClosedLost?: boolean;
  slaHours?: number;
  colorHex?: string;
}

export interface UpdatePipelineStageDto {
  pipelineId?: string;
  name?: string;
  orderIndex?: number;
  probability?: number;
  isClosedWon?: boolean;
  isClosedLost?: boolean;
  slaHours?: number;
  colorHex?: string;
}

export interface PipelineStageFilterDto extends PaginationParams {
  search?: string;
  startDate?: ISODateString;
  endDate?: ISODateString;
  pipelineId?: string;
  name?: string;
  orderIndex?: number;
  probability?: number;
}

export class PipelineStageValidator {
  public static validateCreate(dto: CreatePipelineStageDto): void {
    if (!dto) {
      throw new ValidationError('Request body for PipelineStage cannot be empty');
    }
  }

  public static validateUpdate(id: UUID, dto: UpdatePipelineStageDto): void {
    if (!id) {
      throw new ValidationError('PipelineStage ID is required for update');
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
