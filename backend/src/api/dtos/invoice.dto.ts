/**
 * RelateIQ Enterprise CRM - Invoice Data Transfer Objects & Validation Schemas
 * Comprehensive schema definition, sanitization rules, and runtime validators.
 */

import { UUID, ISODateString, PaginationParams } from '../../core/types/common.types';
import { ValidationError } from '../../core/errors/app-error';

export interface CreateInvoiceDto {
  accountId?: string;
  dealId?: string;
  invoiceNumber?: string;
  subtotal?: number;
  taxRate?: number;
  taxAmount?: number;
  totalAmount?: number;
  status?: string;
  dueDate?: string;
}

export interface UpdateInvoiceDto {
  accountId?: string;
  dealId?: string;
  invoiceNumber?: string;
  subtotal?: number;
  taxRate?: number;
  taxAmount?: number;
  totalAmount?: number;
  status?: string;
  dueDate?: string;
}

export interface InvoiceFilterDto extends PaginationParams {
  search?: string;
  startDate?: ISODateString;
  endDate?: ISODateString;
  accountId?: string;
  dealId?: string;
  invoiceNumber?: string;
  subtotal?: number;
}

export class InvoiceValidator {
  public static validateCreate(dto: CreateInvoiceDto): void {
    if (!dto) {
      throw new ValidationError('Request body for Invoice cannot be empty');
    }
  }

  public static validateUpdate(id: UUID, dto: UpdateInvoiceDto): void {
    if (!id) {
      throw new ValidationError('Invoice ID is required for update');
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
