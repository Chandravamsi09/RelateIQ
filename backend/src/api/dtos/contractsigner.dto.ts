/**
 * RelateIQ Enterprise CRM - ContractSigner Data Transfer Objects & Validation Schemas
 * Comprehensive schema definition, sanitization rules, and runtime validators.
 */

import { UUID, ISODateString, PaginationParams } from '../../core/types/common.types';
import { ValidationError } from '../../core/errors/app-error';

export interface CreateContractSignerDto {
  contractId?: string;
  signerName?: string;
  signerEmail?: string;
  role?: string;
  status?: string;
  signedAt?: string;
  signatureIp?: string;
}

export interface UpdateContractSignerDto {
  contractId?: string;
  signerName?: string;
  signerEmail?: string;
  role?: string;
  status?: string;
  signedAt?: string;
  signatureIp?: string;
}

export interface ContractSignerFilterDto extends PaginationParams {
  search?: string;
  startDate?: ISODateString;
  endDate?: ISODateString;
  contractId?: string;
  signerName?: string;
  signerEmail?: string;
  role?: string;
}

export class ContractSignerValidator {
  public static validateCreate(dto: CreateContractSignerDto): void {
    if (!dto) {
      throw new ValidationError('Request body for ContractSigner cannot be empty');
    }
  }

  public static validateUpdate(id: UUID, dto: UpdateContractSignerDto): void {
    if (!id) {
      throw new ValidationError('ContractSigner ID is required for update');
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
