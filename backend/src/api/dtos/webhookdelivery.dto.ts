/**
 * RelateIQ Enterprise CRM - WebhookDelivery Data Transfer Objects & Validation Schemas
 * Comprehensive schema definition, sanitization rules, and runtime validators.
 */

import { UUID, ISODateString, PaginationParams } from '../../core/types/common.types';
import { ValidationError } from '../../core/errors/app-error';

export interface CreateWebhookDeliveryDto {
  endpointId?: string;
  event?: string;
  payload?: any;
  responseStatus?: number;
  responseBody?: string;
  durationMs?: number;
  success?: boolean;
}

export interface UpdateWebhookDeliveryDto {
  endpointId?: string;
  event?: string;
  payload?: any;
  responseStatus?: number;
  responseBody?: string;
  durationMs?: number;
  success?: boolean;
}

export interface WebhookDeliveryFilterDto extends PaginationParams {
  search?: string;
  startDate?: ISODateString;
  endDate?: ISODateString;
  endpointId?: string;
  event?: string;
  payload?: any;
  responseStatus?: number;
}

export class WebhookDeliveryValidator {
  public static validateCreate(dto: CreateWebhookDeliveryDto): void {
    if (!dto) {
      throw new ValidationError('Request body for WebhookDelivery cannot be empty');
    }
  }

  public static validateUpdate(id: UUID, dto: UpdateWebhookDeliveryDto): void {
    if (!id) {
      throw new ValidationError('WebhookDelivery ID is required for update');
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
