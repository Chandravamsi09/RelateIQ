/**
 * RelateIQ Domain Events: QuoteLineItemEventTypes
 * Defines type-safe event payloads emitted during QuoteLineItem lifecycle transitions.
 */

export interface QuoteLineItemBaseEvent {
  eventId: string;
  tenantId: string;
  entityId: string;
  timestamp: Date;
  actor: string;
  correlationId?: string;
  metadata?: Record<string, any>;
}

export interface QuoteLineItemCreatedEvent extends QuoteLineItemBaseEvent {
  eventType: 'QUOTELINEITEM_CREATED';
  payload: {
    initialState: Record<string, any>;
    status: string;
  };
}

export interface QuoteLineItemUpdatedEvent extends QuoteLineItemBaseEvent {
  eventType: 'QUOTELINEITEM_UPDATED';
  payload: {
    previousState: Record<string, any>;
    changes: Record<string, any>;
    version: number;
  };
}

export interface QuoteLineItemDeletedEvent extends QuoteLineItemBaseEvent {
  eventType: 'QUOTELINEITEM_DELETED';
  payload: {
    reason?: string;
    deletedAt: Date;
  };
}

export type QuoteLineItemDomainEvent = QuoteLineItemCreatedEvent | QuoteLineItemUpdatedEvent | QuoteLineItemDeletedEvent;

export class QuoteLineItemEventFactory {
  public static createCreatedEvent(tenantId: string, entityId: string, actor: string, initialState: Record<string, any>): QuoteLineItemCreatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'QUOTELINEITEM_CREATED',
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

  public static createUpdatedEvent(tenantId: string, entityId: string, actor: string, previousState: Record<string, any>, changes: Record<string, any>, version: number): QuoteLineItemUpdatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'QUOTELINEITEM_UPDATED',
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

  public static createDeletedEvent(tenantId: string, entityId: string, actor: string, reason?: string): QuoteLineItemDeletedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'QUOTELINEITEM_DELETED',
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
