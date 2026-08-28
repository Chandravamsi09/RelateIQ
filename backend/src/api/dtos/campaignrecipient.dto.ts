/**
 * RelateIQ Enterprise CRM - CampaignRecipient Data Transfer Objects & Validation Schemas
 * Comprehensive schema definition, sanitization rules, and runtime validators.
 */

import { UUID, ISODateString, PaginationParams } from '../../core/types/common.types';
import { ValidationError } from '../../core/errors/app-error';

export interface CreateCampaignRecipientDto {
  campaignId?: string;
  contactId?: string;
  leadId?: string;
  email?: string;
  status?: string;
  openedAt?: string;
  clickedAt?: string;
}

export interface UpdateCampaignRecipientDto {
  campaignId?: string;
  contactId?: string;
  leadId?: string;
  email?: string;
  status?: string;
  openedAt?: string;
  clickedAt?: string;
}

export interface CampaignRecipientFilterDto extends PaginationParams {
  search?: string;
  startDate?: ISODateString;
  endDate?: ISODateString;
  campaignId?: string;
  contactId?: string;
  leadId?: string;
  email?: string;
}

export class CampaignRecipientValidator {
  public static validateCreate(dto: CreateCampaignRecipientDto): void {
    if (!dto) {
      throw new ValidationError('Request body for CampaignRecipient cannot be empty');
    }
  }

  public static validateUpdate(id: UUID, dto: UpdateCampaignRecipientDto): void {
    if (!id) {
      throw new ValidationError('CampaignRecipient ID is required for update');
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
