/**
 * RelateIQ Enterprise CRM - Notification Data Transfer Objects & Validation Schemas
 * Comprehensive schema definition, sanitization rules, and runtime validators.
 */

import { UUID, ISODateString, PaginationParams } from '../../core/types/common.types';
import { ValidationError } from '../../core/errors/app-error';

export interface CreateNotificationDto {
  userId?: string;
  type?: string;
  title?: string;
  message?: string;
  link?: string;
  isRead?: boolean;
}

export interface UpdateNotificationDto {
  userId?: string;
  type?: string;
  title?: string;
  message?: string;
  link?: string;
  isRead?: boolean;
}

export interface NotificationFilterDto extends PaginationParams {
  search?: string;
  startDate?: ISODateString;
  endDate?: ISODateString;
  userId?: string;
  type?: string;
  title?: string;
  message?: string;
}

export class NotificationValidator {
  public static validateCreate(dto: CreateNotificationDto): void {
    if (!dto) {
      throw new ValidationError('Request body for Notification cannot be empty');
    }
  }

  public static validateUpdate(id: UUID, dto: UpdateNotificationDto): void {
    if (!id) {
      throw new ValidationError('Notification ID is required for update');
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
