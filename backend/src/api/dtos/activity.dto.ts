/**
 * RelateIQ Enterprise CRM - Activity Data Transfer Objects & Validation Schemas
 * Comprehensive schema definition, sanitization rules, and runtime validators.
 */

import { UUID, ISODateString, PaginationParams } from '../../core/types/common.types';
import { ValidationError } from '../../core/errors/app-error';

export interface CreateActivityDto {
  type?: string;
  subject?: string;
  description?: string;
  priority?: string;
  status?: string;
  dueDate?: string;
  startDate?: string;
  endDate?: string;
  assignedUserId?: string;
  accountId?: string;
  contactId?: string;
  leadId?: string;
  dealId?: string;
}

export interface UpdateActivityDto {
  type?: string;
  subject?: string;
  description?: string;
  priority?: string;
  status?: string;
  dueDate?: string;
  startDate?: string;
  endDate?: string;
  assignedUserId?: string;
  accountId?: string;
  contactId?: string;
  leadId?: string;
  dealId?: string;
}

export interface ActivityFilterDto extends PaginationParams {
  search?: string;
  startDate?: ISODateString;
  endDate?: ISODateString;
  type?: string;
  subject?: string;
  description?: string;
  priority?: string;
}

export class ActivityValidator {
  public static validateCreate(dto: CreateActivityDto): void {
    if (!dto) {
      throw new ValidationError('Request body for Activity cannot be empty');
    }
  }

  public static validateUpdate(id: UUID, dto: UpdateActivityDto): void {
    if (!id) {
      throw new ValidationError('Activity ID is required for update');
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
