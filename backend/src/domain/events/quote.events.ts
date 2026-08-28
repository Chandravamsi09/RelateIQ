/**
 * RelateIQ Domain Events: QuoteEventTypes
 * Defines type-safe event payloads emitted during Quote lifecycle transitions.
 */

export interface QuoteBaseEvent {
  eventId: string;
  tenantId: string;
  entityId: string;
  timestamp: Date;
  actor: string;
  correlationId?: string;
  metadata?: Record<string, any>;
}

export interface QuoteCreatedEvent extends QuoteBaseEvent {
  eventType: 'QUOTE_CREATED';
  payload: {
    initialState: Record<string, any>;
    status: string;
  };
}

export interface QuoteUpdatedEvent extends QuoteBaseEvent {
  eventType: 'QUOTE_UPDATED';
  payload: {
    previousState: Record<string, any>;
    changes: Record<string, any>;
    version: number;
  };
}

export interface QuoteDeletedEvent extends QuoteBaseEvent {
  eventType: 'QUOTE_DELETED';
  payload: {
    reason?: string;
    deletedAt: Date;
  };
}

export type QuoteDomainEvent = QuoteCreatedEvent | QuoteUpdatedEvent | QuoteDeletedEvent;

export class QuoteEventFactory {
  public static createCreatedEvent(tenantId: string, entityId: string, actor: string, initialState: Record<string, any>): QuoteCreatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'QUOTE_CREATED',
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

  public static createUpdatedEvent(tenantId: string, entityId: string, actor: string, previousState: Record<string, any>, changes: Record<string, any>, version: number): QuoteUpdatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'QUOTE_UPDATED',
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

  public static createDeletedEvent(tenantId: string, entityId: string, actor: string, reason?: string): QuoteDeletedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'QUOTE_DELETED',
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
