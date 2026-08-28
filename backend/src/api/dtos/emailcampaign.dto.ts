/**
 * RelateIQ Enterprise CRM - EmailCampaign Data Transfer Objects & Validation Schemas
 * Comprehensive schema definition, sanitization rules, and runtime validators.
 */

import { UUID, ISODateString, PaginationParams } from '../../core/types/common.types';
import { ValidationError } from '../../core/errors/app-error';

export interface CreateEmailCampaignDto {
  name?: string;
  subject?: string;
  bodyHtml?: string;
  status?: string;
  sentCount?: number;
  openCount?: number;
  clickCount?: number;
  scheduledFor?: string;
}

export interface UpdateEmailCampaignDto {
  name?: string;
  subject?: string;
  bodyHtml?: string;
  status?: string;
  sentCount?: number;
  openCount?: number;
  clickCount?: number;
  scheduledFor?: string;
}

export interface EmailCampaignFilterDto extends PaginationParams {
  search?: string;
  startDate?: ISODateString;
  endDate?: ISODateString;
  name?: string;
  subject?: string;
  bodyHtml?: string;
  status?: string;
}

export class EmailCampaignValidator {
  public static validateCreate(dto: CreateEmailCampaignDto): void {
    if (!dto) {
      throw new ValidationError('Request body for EmailCampaign cannot be empty');
    }
  }

  public static validateUpdate(id: UUID, dto: UpdateEmailCampaignDto): void {
    if (!id) {
      throw new ValidationError('EmailCampaign ID is required for update');
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
