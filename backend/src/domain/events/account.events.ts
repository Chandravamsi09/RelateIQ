/**
 * RelateIQ Domain Events: AccountEventTypes
 * Defines type-safe event payloads emitted during Account lifecycle transitions.
 */

export interface AccountBaseEvent {
  eventId: string;
  tenantId: string;
  entityId: string;
  timestamp: Date;
  actor: string;
  correlationId?: string;
  metadata?: Record<string, any>;
}

export interface AccountCreatedEvent extends AccountBaseEvent {
  eventType: 'ACCOUNT_CREATED';
  payload: {
    initialState: Record<string, any>;
    status: string;
  };
}

export interface AccountUpdatedEvent extends AccountBaseEvent {
  eventType: 'ACCOUNT_UPDATED';
  payload: {
    previousState: Record<string, any>;
    changes: Record<string, any>;
    version: number;
  };
}

export interface AccountDeletedEvent extends AccountBaseEvent {
  eventType: 'ACCOUNT_DELETED';
  payload: {
    reason?: string;
    deletedAt: Date;
  };
}

export type AccountDomainEvent = AccountCreatedEvent | AccountUpdatedEvent | AccountDeletedEvent;

export class AccountEventFactory {
  public static createCreatedEvent(tenantId: string, entityId: string, actor: string, initialState: Record<string, any>): AccountCreatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'ACCOUNT_CREATED',
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

  public static createUpdatedEvent(tenantId: string, entityId: string, actor: string, previousState: Record<string, any>, changes: Record<string, any>, version: number): AccountUpdatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'ACCOUNT_UPDATED',
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

  public static createDeletedEvent(tenantId: string, entityId: string, actor: string, reason?: string): AccountDeletedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'ACCOUNT_DELETED',
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
