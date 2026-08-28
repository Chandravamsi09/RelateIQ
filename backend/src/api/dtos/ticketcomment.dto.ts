/**
 * RelateIQ Enterprise CRM - TicketComment Data Transfer Objects & Validation Schemas
 * Comprehensive schema definition, sanitization rules, and runtime validators.
 */

import { UUID, ISODateString, PaginationParams } from '../../core/types/common.types';
import { ValidationError } from '../../core/errors/app-error';

export interface CreateTicketCommentDto {
  ticketId?: string;
  authorId?: string;
  body?: string;
  isInternal?: boolean;
}

export interface UpdateTicketCommentDto {
  ticketId?: string;
  authorId?: string;
  body?: string;
  isInternal?: boolean;
}

export interface TicketCommentFilterDto extends PaginationParams {
  search?: string;
  startDate?: ISODateString;
  endDate?: ISODateString;
  ticketId?: string;
  authorId?: string;
  body?: string;
  isInternal?: boolean;
}

export class TicketCommentValidator {
  public static validateCreate(dto: CreateTicketCommentDto): void {
    if (!dto) {
      throw new ValidationError('Request body for TicketComment cannot be empty');
    }
  }

  public static validateUpdate(id: UUID, dto: UpdateTicketCommentDto): void {
    if (!id) {
      throw new ValidationError('TicketComment ID is required for update');
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
