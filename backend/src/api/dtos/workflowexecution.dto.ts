/**
 * RelateIQ Enterprise CRM - WorkflowExecution Data Transfer Objects & Validation Schemas
 * Comprehensive schema definition, sanitization rules, and runtime validators.
 */

import { UUID, ISODateString, PaginationParams } from '../../core/types/common.types';
import { ValidationError } from '../../core/errors/app-error';

export interface CreateWorkflowExecutionDto {
  workflowId?: string;
  entityId?: string;
  status?: string;
  executionLog?: any;
  startedAt?: string;
  completedAt?: string;
}

export interface UpdateWorkflowExecutionDto {
  workflowId?: string;
  entityId?: string;
  status?: string;
  executionLog?: any;
  startedAt?: string;
  completedAt?: string;
}

export interface WorkflowExecutionFilterDto extends PaginationParams {
  search?: string;
  startDate?: ISODateString;
  endDate?: ISODateString;
  workflowId?: string;
  entityId?: string;
  status?: string;
  executionLog?: any;
}

export class WorkflowExecutionValidator {
  public static validateCreate(dto: CreateWorkflowExecutionDto): void {
    if (!dto) {
      throw new ValidationError('Request body for WorkflowExecution cannot be empty');
    }
  }

  public static validateUpdate(id: UUID, dto: UpdateWorkflowExecutionDto): void {
    if (!id) {
      throw new ValidationError('WorkflowExecution ID is required for update');
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
