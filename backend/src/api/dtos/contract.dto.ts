/**
 * RelateIQ Enterprise CRM - Contract Data Transfer Objects & Validation Schemas
 * Comprehensive schema definition, sanitization rules, and runtime validators.
 */

import { UUID, ISODateString, PaginationParams } from '../../core/types/common.types';
import { ValidationError } from '../../core/errors/app-error';

export interface CreateContractDto {
  accountId?: string;
  dealId?: string;
  title?: string;
  contractValue?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
  signedAt?: string;
}

export interface UpdateContractDto {
  accountId?: string;
  dealId?: string;
  title?: string;
  contractValue?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
  signedAt?: string;
}

export interface ContractFilterDto extends PaginationParams {
  search?: string;
  startDate?: ISODateString;
  endDate?: ISODateString;
  accountId?: string;
  dealId?: string;
  title?: string;
  contractValue?: number;
}

export class ContractValidator {
  public static validateCreate(dto: CreateContractDto): void {
    if (!dto) {
      throw new ValidationError('Request body for Contract cannot be empty');
    }
  }

  public static validateUpdate(id: UUID, dto: UpdateContractDto): void {
    if (!id) {
      throw new ValidationError('Contract ID is required for update');
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
