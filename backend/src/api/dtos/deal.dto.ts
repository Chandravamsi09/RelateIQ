/**
 * RelateIQ Enterprise CRM - Deal Data Transfer Objects & Validation Schemas
 * Comprehensive schema definition, sanitization rules, and runtime validators.
 */

import { UUID, ISODateString, PaginationParams } from '../../core/types/common.types';
import { ValidationError } from '../../core/errors/app-error';

export interface CreateDealDto {
  accountId?: string;
  pipelineId?: string;
  stageId?: string;
  ownerUserId?: string;
  title?: string;
  amount?: number;
  currency?: string;
  expectedCloseDate?: string;
  probability?: number;
  status?: string;
  lostReason?: string;
}

export interface UpdateDealDto {
  accountId?: string;
  pipelineId?: string;
  stageId?: string;
  ownerUserId?: string;
  title?: string;
  amount?: number;
  currency?: string;
  expectedCloseDate?: string;
  probability?: number;
  status?: string;
  lostReason?: string;
}

export interface DealFilterDto extends PaginationParams {
  search?: string;
  startDate?: ISODateString;
  endDate?: ISODateString;
  accountId?: string;
  pipelineId?: string;
  stageId?: string;
  ownerUserId?: string;
}

export class DealValidator {
  public static validateCreate(dto: CreateDealDto): void {
    if (!dto) {
      throw new ValidationError('Request body for Deal cannot be empty');
    }
  }

  public static validateUpdate(id: UUID, dto: UpdateDealDto): void {
    if (!id) {
      throw new ValidationError('Deal ID is required for update');
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
