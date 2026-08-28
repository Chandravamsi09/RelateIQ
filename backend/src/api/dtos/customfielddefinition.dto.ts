/**
 * RelateIQ Enterprise CRM - CustomFieldDefinition Data Transfer Objects & Validation Schemas
 * Comprehensive schema definition, sanitization rules, and runtime validators.
 */

import { UUID, ISODateString, PaginationParams } from '../../core/types/common.types';
import { ValidationError } from '../../core/errors/app-error';

export interface CreateCustomFieldDefinitionDto {
  entityType?: string;
  fieldName?: string;
  fieldLabel?: string;
  fieldType?: string;
  isRequired?: boolean;
  options?: string[];
  displayOrder?: number;
}

export interface UpdateCustomFieldDefinitionDto {
  entityType?: string;
  fieldName?: string;
  fieldLabel?: string;
  fieldType?: string;
  isRequired?: boolean;
  options?: string[];
  displayOrder?: number;
}

export interface CustomFieldDefinitionFilterDto extends PaginationParams {
  search?: string;
  startDate?: ISODateString;
  endDate?: ISODateString;
  entityType?: string;
  fieldName?: string;
  fieldLabel?: string;
  fieldType?: string;
}

export class CustomFieldDefinitionValidator {
  public static validateCreate(dto: CreateCustomFieldDefinitionDto): void {
    if (!dto) {
      throw new ValidationError('Request body for CustomFieldDefinition cannot be empty');
    }
  }

  public static validateUpdate(id: UUID, dto: UpdateCustomFieldDefinitionDto): void {
    if (!id) {
      throw new ValidationError('CustomFieldDefinition ID is required for update');
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
