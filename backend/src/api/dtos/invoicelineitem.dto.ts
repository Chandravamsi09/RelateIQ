/**
 * RelateIQ Enterprise CRM - InvoiceLineItem Data Transfer Objects & Validation Schemas
 * Comprehensive schema definition, sanitization rules, and runtime validators.
 */

import { UUID, ISODateString, PaginationParams } from '../../core/types/common.types';
import { ValidationError } from '../../core/errors/app-error';

export interface CreateInvoiceLineItemDto {
  invoiceId?: string;
  description?: string;
  quantity?: number;
  unitPrice?: number;
  amount?: number;
}

export interface UpdateInvoiceLineItemDto {
  invoiceId?: string;
  description?: string;
  quantity?: number;
  unitPrice?: number;
  amount?: number;
}

export interface InvoiceLineItemFilterDto extends PaginationParams {
  search?: string;
  startDate?: ISODateString;
  endDate?: ISODateString;
  invoiceId?: string;
  description?: string;
  quantity?: number;
  unitPrice?: number;
}

export class InvoiceLineItemValidator {
  public static validateCreate(dto: CreateInvoiceLineItemDto): void {
    if (!dto) {
      throw new ValidationError('Request body for InvoiceLineItem cannot be empty');
    }
  }

  public static validateUpdate(id: UUID, dto: UpdateInvoiceLineItemDto): void {
    if (!id) {
      throw new ValidationError('InvoiceLineItem ID is required for update');
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
