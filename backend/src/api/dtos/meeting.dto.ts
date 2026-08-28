/**
 * RelateIQ Enterprise CRM - Meeting Data Transfer Objects & Validation Schemas
 * Comprehensive schema definition, sanitization rules, and runtime validators.
 */

import { UUID, ISODateString, PaginationParams } from '../../core/types/common.types';
import { ValidationError } from '../../core/errors/app-error';

export interface CreateMeetingDto {
  title?: string;
  location?: string;
  meetingUrl?: string;
  startTime?: string;
  endTime?: string;
  attendeeEmails?: string[];
  agenda?: string;
  summary?: string;
}

export interface UpdateMeetingDto {
  title?: string;
  location?: string;
  meetingUrl?: string;
  startTime?: string;
  endTime?: string;
  attendeeEmails?: string[];
  agenda?: string;
  summary?: string;
}

export interface MeetingFilterDto extends PaginationParams {
  search?: string;
  startDate?: ISODateString;
  endDate?: ISODateString;
  title?: string;
  location?: string;
  meetingUrl?: string;
  startTime?: string;
}

export class MeetingValidator {
  public static validateCreate(dto: CreateMeetingDto): void {
    if (!dto) {
      throw new ValidationError('Request body for Meeting cannot be empty');
    }
  }

  public static validateUpdate(id: UUID, dto: UpdateMeetingDto): void {
    if (!id) {
      throw new ValidationError('Meeting ID is required for update');
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
