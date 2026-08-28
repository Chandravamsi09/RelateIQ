/**
 * RelateIQ Enterprise CRM - CallLog Data Transfer Objects & Validation Schemas
 * Comprehensive schema definition, sanitization rules, and runtime validators.
 */

import { UUID, ISODateString, PaginationParams } from '../../core/types/common.types';
import { ValidationError } from '../../core/errors/app-error';

export interface CreateCallLogDto {
  contactId?: string;
  leadId?: string;
  durationMinutes?: number;
  callType?: string;
  outcome?: string;
  recordingUrl?: string;
  notes?: string;
}

export interface UpdateCallLogDto {
  contactId?: string;
  leadId?: string;
  durationMinutes?: number;
  callType?: string;
  outcome?: string;
  recordingUrl?: string;
  notes?: string;
}

export interface CallLogFilterDto extends PaginationParams {
  search?: string;
  startDate?: ISODateString;
  endDate?: ISODateString;
  contactId?: string;
  leadId?: string;
  durationMinutes?: number;
  callType?: string;
}

export class CallLogValidator {
  public static validateCreate(dto: CreateCallLogDto): void {
    if (!dto) {
      throw new ValidationError('Request body for CallLog cannot be empty');
    }
  }

  public static validateUpdate(id: UUID, dto: UpdateCallLogDto): void {
    if (!id) {
      throw new ValidationError('CallLog ID is required for update');
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
