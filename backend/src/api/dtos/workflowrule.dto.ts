/**
 * RelateIQ Enterprise CRM - WorkflowRule Data Transfer Objects & Validation Schemas
 * Comprehensive schema definition, sanitization rules, and runtime validators.
 */

import { UUID, ISODateString, PaginationParams } from '../../core/types/common.types';
import { ValidationError } from '../../core/errors/app-error';

export interface CreateWorkflowRuleDto {
  name?: string;
  description?: string;
  isActive?: boolean;
  triggerType?: string;
  triggerConfig?: any;
  conditions?: any[];
  actions?: any[];
}

export interface UpdateWorkflowRuleDto {
  name?: string;
  description?: string;
  isActive?: boolean;
  triggerType?: string;
  triggerConfig?: any;
  conditions?: any[];
  actions?: any[];
}

export interface WorkflowRuleFilterDto extends PaginationParams {
  search?: string;
  startDate?: ISODateString;
  endDate?: ISODateString;
  name?: string;
  description?: string;
  isActive?: boolean;
  triggerType?: string;
}

export class WorkflowRuleValidator {
  public static validateCreate(dto: CreateWorkflowRuleDto): void {
    if (!dto) {
      throw new ValidationError('Request body for WorkflowRule cannot be empty');
    }
  }

  public static validateUpdate(id: UUID, dto: UpdateWorkflowRuleDto): void {
    if (!id) {
      throw new ValidationError('WorkflowRule ID is required for update');
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
