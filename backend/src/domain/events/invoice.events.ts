/**
 * RelateIQ Domain Events: InvoiceEventTypes
 * Defines type-safe event payloads emitted during Invoice lifecycle transitions.
 */

export interface InvoiceBaseEvent {
  eventId: string;
  tenantId: string;
  entityId: string;
  timestamp: Date;
  actor: string;
  correlationId?: string;
  metadata?: Record<string, any>;
}

export interface InvoiceCreatedEvent extends InvoiceBaseEvent {
  eventType: 'INVOICE_CREATED';
  payload: {
    initialState: Record<string, any>;
    status: string;
  };
}

export interface InvoiceUpdatedEvent extends InvoiceBaseEvent {
  eventType: 'INVOICE_UPDATED';
  payload: {
    previousState: Record<string, any>;
    changes: Record<string, any>;
    version: number;
  };
}

export interface InvoiceDeletedEvent extends InvoiceBaseEvent {
  eventType: 'INVOICE_DELETED';
  payload: {
    reason?: string;
    deletedAt: Date;
  };
}

export type InvoiceDomainEvent = InvoiceCreatedEvent | InvoiceUpdatedEvent | InvoiceDeletedEvent;

export class InvoiceEventFactory {
  public static createCreatedEvent(tenantId: string, entityId: string, actor: string, initialState: Record<string, any>): InvoiceCreatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'INVOICE_CREATED',
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

  public static createUpdatedEvent(tenantId: string, entityId: string, actor: string, previousState: Record<string, any>, changes: Record<string, any>, version: number): InvoiceUpdatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'INVOICE_UPDATED',
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

  public static createDeletedEvent(tenantId: string, entityId: string, actor: string, reason?: string): InvoiceDeletedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'INVOICE_DELETED',
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
