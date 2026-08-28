/**
 * RelateIQ Domain Events: InvoiceItemEventTypes
 * Defines type-safe event payloads emitted during InvoiceItem lifecycle transitions.
 */

export interface InvoiceItemBaseEvent {
  eventId: string;
  tenantId: string;
  entityId: string;
  timestamp: Date;
  actor: string;
  correlationId?: string;
  metadata?: Record<string, any>;
}

export interface InvoiceItemCreatedEvent extends InvoiceItemBaseEvent {
  eventType: 'INVOICEITEM_CREATED';
  payload: {
    initialState: Record<string, any>;
    status: string;
  };
}

export interface InvoiceItemUpdatedEvent extends InvoiceItemBaseEvent {
  eventType: 'INVOICEITEM_UPDATED';
  payload: {
    previousState: Record<string, any>;
    changes: Record<string, any>;
    version: number;
  };
}

export interface InvoiceItemDeletedEvent extends InvoiceItemBaseEvent {
  eventType: 'INVOICEITEM_DELETED';
  payload: {
    reason?: string;
    deletedAt: Date;
  };
}

export type InvoiceItemDomainEvent = InvoiceItemCreatedEvent | InvoiceItemUpdatedEvent | InvoiceItemDeletedEvent;

export class InvoiceItemEventFactory {
  public static createCreatedEvent(tenantId: string, entityId: string, actor: string, initialState: Record<string, any>): InvoiceItemCreatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'INVOICEITEM_CREATED',
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

  public static createUpdatedEvent(tenantId: string, entityId: string, actor: string, previousState: Record<string, any>, changes: Record<string, any>, version: number): InvoiceItemUpdatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'INVOICEITEM_UPDATED',
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

  public static createDeletedEvent(tenantId: string, entityId: string, actor: string, reason?: string): InvoiceItemDeletedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'INVOICEITEM_DELETED',
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
