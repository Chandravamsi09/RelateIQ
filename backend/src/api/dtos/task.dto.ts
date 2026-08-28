/**
 * RelateIQ Enterprise CRM - Task Data Transfer Objects & Validation Schemas
 * Comprehensive schema definition, sanitization rules, and runtime validators.
 */

import { UUID, ISODateString, PaginationParams } from '../../core/types/common.types';
import { ValidationError } from '../../core/errors/app-error';

export interface CreateTaskDto {
  title?: string;
  description?: string;
  dueDate?: string;
  priority?: string;
  status?: string;
  assignedUserId?: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  dueDate?: string;
  priority?: string;
  status?: string;
  assignedUserId?: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
}

export interface TaskFilterDto extends PaginationParams {
  search?: string;
  startDate?: ISODateString;
  endDate?: ISODateString;
  title?: string;
  description?: string;
  dueDate?: string;
  priority?: string;
}

export class TaskValidator {
  public static validateCreate(dto: CreateTaskDto): void {
    if (!dto) {
      throw new ValidationError('Request body for Task cannot be empty');
    }
  }

  public static validateUpdate(id: UUID, dto: UpdateTaskDto): void {
    if (!id) {
      throw new ValidationError('Task ID is required for update');
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
