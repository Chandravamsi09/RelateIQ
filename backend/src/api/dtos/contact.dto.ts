/**
 * RelateIQ Enterprise CRM - Contact Data Transfer Objects & Validation Schemas
 * Comprehensive schema definition, sanitization rules, and runtime validators.
 */

import { UUID, ISODateString, PaginationParams } from '../../core/types/common.types';
import { ValidationError } from '../../core/errors/app-error';

export interface CreateContactDto {
  accountId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  mobilePhone?: string;
  title?: string;
  department?: string;
  isPrimary?: boolean;
  linkedinUrl?: string;
}

export interface UpdateContactDto {
  accountId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  mobilePhone?: string;
  title?: string;
  department?: string;
  isPrimary?: boolean;
  linkedinUrl?: string;
}

export interface ContactFilterDto extends PaginationParams {
  search?: string;
  startDate?: ISODateString;
  endDate?: ISODateString;
  accountId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export class ContactValidator {
  public static validateCreate(dto: CreateContactDto): void {
    if (!dto) {
      throw new ValidationError('Request body for Contact cannot be empty');
    }
  }

  public static validateUpdate(id: UUID, dto: UpdateContactDto): void {
    if (!id) {
      throw new ValidationError('Contact ID is required for update');
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
