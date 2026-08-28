/**
 * RelateIQ Enterprise CRM - Lead Data Transfer Objects & Validation Schemas
 * Comprehensive schema definition, sanitization rules, and runtime validators.
 */

import { UUID, ISODateString, PaginationParams } from '../../core/types/common.types';
import { ValidationError } from '../../core/errors/app-error';

export interface CreateLeadDto {
  assignedUserId?: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  title?: string;
  email?: string;
  phone?: string;
  website?: string;
  source?: string;
  status?: string;
  score?: number;
  estimatedValue?: number;
  notes?: string;
}

export interface UpdateLeadDto {
  assignedUserId?: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  title?: string;
  email?: string;
  phone?: string;
  website?: string;
  source?: string;
  status?: string;
  score?: number;
  estimatedValue?: number;
  notes?: string;
}

export interface LeadFilterDto extends PaginationParams {
  search?: string;
  startDate?: ISODateString;
  endDate?: ISODateString;
  assignedUserId?: string;
  firstName?: string;
  lastName?: string;
  company?: string;
}

export class LeadValidator {
  public static validateCreate(dto: CreateLeadDto): void {
    if (!dto) {
      throw new ValidationError('Request body for Lead cannot be empty');
    }
  }

  public static validateUpdate(id: UUID, dto: UpdateLeadDto): void {
    if (!id) {
      throw new ValidationError('Lead ID is required for update');
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
