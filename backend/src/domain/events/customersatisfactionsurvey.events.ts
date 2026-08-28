/**
 * RelateIQ Domain Events: CustomerSatisfactionSurveyEventTypes
 * Defines type-safe event payloads emitted during CustomerSatisfactionSurvey lifecycle transitions.
 */

export interface CustomerSatisfactionSurveyBaseEvent {
  eventId: string;
  tenantId: string;
  entityId: string;
  timestamp: Date;
  actor: string;
  correlationId?: string;
  metadata?: Record<string, any>;
}

export interface CustomerSatisfactionSurveyCreatedEvent extends CustomerSatisfactionSurveyBaseEvent {
  eventType: 'CUSTOMERSATISFACTIONSURVEY_CREATED';
  payload: {
    initialState: Record<string, any>;
    status: string;
  };
}

export interface CustomerSatisfactionSurveyUpdatedEvent extends CustomerSatisfactionSurveyBaseEvent {
  eventType: 'CUSTOMERSATISFACTIONSURVEY_UPDATED';
  payload: {
    previousState: Record<string, any>;
    changes: Record<string, any>;
    version: number;
  };
}

export interface CustomerSatisfactionSurveyDeletedEvent extends CustomerSatisfactionSurveyBaseEvent {
  eventType: 'CUSTOMERSATISFACTIONSURVEY_DELETED';
  payload: {
    reason?: string;
    deletedAt: Date;
  };
}

export type CustomerSatisfactionSurveyDomainEvent = CustomerSatisfactionSurveyCreatedEvent | CustomerSatisfactionSurveyUpdatedEvent | CustomerSatisfactionSurveyDeletedEvent;

export class CustomerSatisfactionSurveyEventFactory {
  public static createCreatedEvent(tenantId: string, entityId: string, actor: string, initialState: Record<string, any>): CustomerSatisfactionSurveyCreatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'CUSTOMERSATISFACTIONSURVEY_CREATED',
      tenantId,
      entityId,
      actor,
      timestamp: new Date(),
      payload: {
        initialState,
        status: initialState.status || 'ACTIVE'
      }
    };
  }

  public static createUpdatedEvent(tenantId: string, entityId: string, actor: string, previousState: Record<string, any>, changes: Record<string, any>, version: number): CustomerSatisfactionSurveyUpdatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'CUSTOMERSATISFACTIONSURVEY_UPDATED',
      tenantId,
      entityId,
      actor,
      timestamp: new Date(),
      payload: {
        previousState,
        changes,
        version
      }
    };
  }

  public static createDeletedEvent(tenantId: string, entityId: string, actor: string, reason?: string): CustomerSatisfactionSurveyDeletedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'CUSTOMERSATISFACTIONSURVEY_DELETED',
      tenantId,
      entityId,
      actor,
      timestamp: new Date(),
      payload: {
        reason: reason || 'Explicit user deactivation',
        deletedAt: new Date()
      }
    };
  }
}
