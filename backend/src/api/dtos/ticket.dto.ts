/**
 * RelateIQ Enterprise CRM - Ticket Data Transfer Objects & Validation Schemas
 * Comprehensive schema definition, sanitization rules, and runtime validators.
 */

import { UUID, ISODateString, PaginationParams } from '../../core/types/common.types';
import { ValidationError } from '../../core/errors/app-error';

export interface CreateTicketDto {
  subject?: string;
  description?: string;
  priority?: string;
  status?: string;
  assignedUserId?: string;
  accountId?: string;
  contactId?: string;
  slaDueAt?: string;
  isSlaBreached?: boolean;
}

export interface UpdateTicketDto {
  subject?: string;
  description?: string;
  priority?: string;
  status?: string;
  assignedUserId?: string;
  accountId?: string;
  contactId?: string;
  slaDueAt?: string;
  isSlaBreached?: boolean;
}

export interface TicketFilterDto extends PaginationParams {
  search?: string;
  startDate?: ISODateString;
  endDate?: ISODateString;
  subject?: string;
  description?: string;
  priority?: string;
  status?: string;
}

export class TicketValidator {
  public static validateCreate(dto: CreateTicketDto): void {
    if (!dto) {
      throw new ValidationError('Request body for Ticket cannot be empty');
    }
  }

  public static validateUpdate(id: UUID, dto: UpdateTicketDto): void {
    if (!id) {
      throw new ValidationError('Ticket ID is required for update');
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
