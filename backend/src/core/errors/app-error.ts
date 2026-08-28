/**
 * RelateIQ Enterprise CRM - Standardized Error Hierarchy
 * Provides granular error representations with status codes and telemetry.
 */

export abstract class AppError extends Error {
  public abstract readonly statusCode: number;
  public abstract readonly errorCode: string;
  public readonly isOperational: boolean = true;
  public readonly timestamp: string;
  public readonly details?: any;

  constructor(message: string, details?: any) {
    super(message);
    this.name = this.constructor.name;
    this.timestamp = new Date().toISOString();
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }

  public toJSON() {
    return {
      errorCode: this.errorCode,
      message: this.message,
      statusCode: this.statusCode,
      timestamp: this.timestamp,
      details: this.details
    };
  }
}

export class ValidationError extends AppError {
  public readonly statusCode = 400;
  public readonly errorCode = 'VALIDATION_ERROR';
}

export class AuthenticationError extends AppError {
  public readonly statusCode = 401;
  public readonly errorCode = 'AUTHENTICATION_REQUIRED';
}

export class ForbiddenError extends AppError {
  public readonly statusCode = 403;
  public readonly errorCode = 'PERMISSION_DENIED';
}

export class NotFoundError extends AppError {
  public readonly statusCode = 404;
  public readonly errorCode = 'RESOURCE_NOT_FOUND';
}

export class ConflictError extends AppError {
  public readonly statusCode = 409;
  public readonly errorCode = 'RESOURCE_CONFLICT';
}

export class RateLimitError extends AppError {
  public readonly statusCode = 429;
  public readonly errorCode = 'RATE_LIMIT_EXCEEDED';
}

export class TenantIsolationError extends AppError {
  public readonly statusCode = 403;
  public readonly errorCode = 'TENANT_ISOLATION_VIOLATION';
}

export class BusinessRuleViolationError extends AppError {
  public readonly statusCode = 422;
  public readonly errorCode = 'BUSINESS_RULE_VIOLATION';
}

export class ExternalServiceError extends AppError {
  public readonly statusCode = 502;
  public readonly errorCode = 'EXTERNAL_SERVICE_FAILURE';
}

export class InternalServerError extends AppError {
  public readonly statusCode = 500;
  public readonly errorCode = 'INTERNAL_SERVER_ERROR';
}
