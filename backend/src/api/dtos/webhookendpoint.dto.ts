/**
 * RelateIQ Enterprise CRM - WebhookEndpoint Data Transfer Objects & Validation Schemas
 * Comprehensive schema definition, sanitization rules, and runtime validators.
 */

import { UUID, ISODateString, PaginationParams } from '../../core/types/common.types';
import { ValidationError } from '../../core/errors/app-error';

export interface CreateWebhookEndpointDto {
  url?: string;
  description?: string;
  secretKey?: string;
  events?: string[];
  isActive?: boolean;
}

export interface UpdateWebhookEndpointDto {
  url?: string;
  description?: string;
  secretKey?: string;
  events?: string[];
  isActive?: boolean;
}

export interface WebhookEndpointFilterDto extends PaginationParams {
  search?: string;
  startDate?: ISODateString;
  endDate?: ISODateString;
  url?: string;
  description?: string;
  secretKey?: string;
  events?: string[];
}

export class WebhookEndpointValidator {
  public static validateCreate(dto: CreateWebhookEndpointDto): void {
    if (!dto) {
      throw new ValidationError('Request body for WebhookEndpoint cannot be empty');
    }
  }

  public static validateUpdate(id: UUID, dto: UpdateWebhookEndpointDto): void {
    if (!id) {
      throw new ValidationError('WebhookEndpoint ID is required for update');
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
