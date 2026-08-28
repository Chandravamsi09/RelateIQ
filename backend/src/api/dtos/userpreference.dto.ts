/**
 * RelateIQ Enterprise CRM - UserPreference Data Transfer Objects & Validation Schemas
 * Comprehensive schema definition, sanitization rules, and runtime validators.
 */

import { UUID, ISODateString, PaginationParams } from '../../core/types/common.types';
import { ValidationError } from '../../core/errors/app-error';

export interface CreateUserPreferenceDto {
  userId?: string;
  theme?: string;
  emailAlerts?: boolean;
  smsAlerts?: boolean;
  compactView?: boolean;
  defaultView?: string;
}

export interface UpdateUserPreferenceDto {
  userId?: string;
  theme?: string;
  emailAlerts?: boolean;
  smsAlerts?: boolean;
  compactView?: boolean;
  defaultView?: string;
}

export interface UserPreferenceFilterDto extends PaginationParams {
  search?: string;
  startDate?: ISODateString;
  endDate?: ISODateString;
  userId?: string;
  theme?: string;
  emailAlerts?: boolean;
  smsAlerts?: boolean;
}

export class UserPreferenceValidator {
  public static validateCreate(dto: CreateUserPreferenceDto): void {
    if (!dto) {
      throw new ValidationError('Request body for UserPreference cannot be empty');
    }
  }

  public static validateUpdate(id: UUID, dto: UpdateUserPreferenceDto): void {
    if (!id) {
      throw new ValidationError('UserPreference ID is required for update');
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
