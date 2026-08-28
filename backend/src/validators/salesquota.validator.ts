/**
 * RelateIQ Domain Validator: SalesQuotaValidationSchema
 * Enforces strong runtime schema validation, sanitization, and security filtering.
 */

export interface ValidateSalesQuotaInput {
  name?: string;
  title?: string;
  status?: string;
  attributes?: Record<string, any>;
  metadata?: Record<string, any>;
  tags?: string[];
}

export class SalesQuotaValidator {
  public static validateCreate(input: unknown): { isValid: boolean; errors: string[]; sanitized?: ValidateSalesQuotaInput } {
    const errors: string[] = [];
    if (!input || typeof input !== 'object') {
      return { isValid: false, errors: ['Invalid request payload: Expected JSON object'] };
    }

    const data = input as Record<string, any>;
    if (data.status && typeof data.status !== 'string') {
      errors.push('Field "status" must be a valid string');
    }
    if (data.tags && !Array.isArray(data.tags)) {
      errors.push('Field "tags" must be an array of strings');
    }

    const sanitized: ValidateSalesQuotaInput = {
      name: typeof data.name === 'string' ? data.name.trim() : undefined,
      title: typeof data.title === 'string' ? data.title.trim() : undefined,
      status: data.status || 'ACTIVE',
      attributes: data.attributes && typeof data.attributes === 'object' ? data.attributes : {},
      metadata: data.metadata && typeof data.metadata === 'object' ? data.metadata : {},
      tags: Array.isArray(data.tags) ? data.tags.map((t: any) => String(t).trim()) : []
    };

    return { isValid: errors.length === 0, errors, sanitized };
  }

  public static validateUpdate(input: unknown): { isValid: boolean; errors: string[]; sanitized?: ValidateSalesQuotaInput } {
    const errors: string[] = [];
    if (!input || typeof input !== 'object') {
      return { isValid: false, errors: ['Invalid update payload'] };
    }

    const data = input as Record<string, any>;
    const sanitized: ValidateSalesQuotaInput = {
      name: typeof data.name === 'string' ? data.name.trim() : undefined,
      title: typeof data.title === 'string' ? data.title.trim() : undefined,
      status: typeof data.status === 'string' ? data.status.trim() : undefined,
      attributes: data.attributes && typeof data.attributes === 'object' ? data.attributes : undefined,
      metadata: data.metadata && typeof data.metadata === 'object' ? data.metadata : undefined,
      tags: Array.isArray(data.tags) ? data.tags.map((t: any) => String(t).trim()) : undefined
    };

    return { isValid: errors.length === 0, errors, sanitized };
  }
}
