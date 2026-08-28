/**
 * RelateIQ Enterprise CRM - User Data Transfer Objects & Validation Schemas
 * Comprehensive schema definition, sanitization rules, and runtime validators.
 */

import { UUID, ISODateString, PaginationParams } from '../../core/types/common.types';
import { ValidationError } from '../../core/errors/app-error';

export interface CreateUserDto {
  email?: string;
  firstName?: string;
  lastName?: string;
  title?: string;
  department?: string;
  phone?: string;
  avatarUrl?: string;
  status?: string;
  twoFactorEnabled?: boolean;
  roles?: string[];
}

export interface UpdateUserDto {
  email?: string;
  firstName?: string;
  lastName?: string;
  title?: string;
  department?: string;
  phone?: string;
  avatarUrl?: string;
  status?: string;
  twoFactorEnabled?: boolean;
  roles?: string[];
}

export interface UserFilterDto extends PaginationParams {
  search?: string;
  startDate?: ISODateString;
  endDate?: ISODateString;
  email?: string;
  firstName?: string;
  lastName?: string;
  title?: string;
}

export class UserValidator {
  public static validateCreate(dto: CreateUserDto): void {
    if (!dto) {
      throw new ValidationError('Request body for User cannot be empty');
    }
  }

  public static validateUpdate(id: UUID, dto: UpdateUserDto): void {
    if (!id) {
      throw new ValidationError('User ID is required for update');
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
