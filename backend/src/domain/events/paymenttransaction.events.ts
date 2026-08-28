/**
 * RelateIQ Domain Events: PaymentTransactionEventTypes
 * Defines type-safe event payloads emitted during PaymentTransaction lifecycle transitions.
 */

export interface PaymentTransactionBaseEvent {
  eventId: string;
  tenantId: string;
  entityId: string;
  timestamp: Date;
  actor: string;
  correlationId?: string;
  metadata?: Record<string, any>;
}

export interface PaymentTransactionCreatedEvent extends PaymentTransactionBaseEvent {
  eventType: 'PAYMENTTRANSACTION_CREATED';
  payload: {
    initialState: Record<string, any>;
    status: string;
  };
}

export interface PaymentTransactionUpdatedEvent extends PaymentTransactionBaseEvent {
  eventType: 'PAYMENTTRANSACTION_UPDATED';
  payload: {
    previousState: Record<string, any>;
    changes: Record<string, any>;
    version: number;
  };
}

export interface PaymentTransactionDeletedEvent extends PaymentTransactionBaseEvent {
  eventType: 'PAYMENTTRANSACTION_DELETED';
  payload: {
    reason?: string;
    deletedAt: Date;
  };
}

export type PaymentTransactionDomainEvent = PaymentTransactionCreatedEvent | PaymentTransactionUpdatedEvent | PaymentTransactionDeletedEvent;

export class PaymentTransactionEventFactory {
  public static createCreatedEvent(tenantId: string, entityId: string, actor: string, initialState: Record<string, any>): PaymentTransactionCreatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'PAYMENTTRANSACTION_CREATED',
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

  public static createUpdatedEvent(tenantId: string, entityId: string, actor: string, previousState: Record<string, any>, changes: Record<string, any>, version: number): PaymentTransactionUpdatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'PAYMENTTRANSACTION_UPDATED',
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

  public static createDeletedEvent(tenantId: string, entityId: string, actor: string, reason?: string): PaymentTransactionDeletedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'PAYMENTTRANSACTION_DELETED',
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
