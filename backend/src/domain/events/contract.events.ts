/**
 * RelateIQ Domain Events: ContractEventTypes
 * Defines type-safe event payloads emitted during Contract lifecycle transitions.
 */

export interface ContractBaseEvent {
  eventId: string;
  tenantId: string;
  entityId: string;
  timestamp: Date;
  actor: string;
  correlationId?: string;
  metadata?: Record<string, any>;
}

export interface ContractCreatedEvent extends ContractBaseEvent {
  eventType: 'CONTRACT_CREATED';
  payload: {
    initialState: Record<string, any>;
    status: string;
  };
}

export interface ContractUpdatedEvent extends ContractBaseEvent {
  eventType: 'CONTRACT_UPDATED';
  payload: {
    previousState: Record<string, any>;
    changes: Record<string, any>;
    version: number;
  };
}

export interface ContractDeletedEvent extends ContractBaseEvent {
  eventType: 'CONTRACT_DELETED';
  payload: {
    reason?: string;
    deletedAt: Date;
  };
}

export type ContractDomainEvent = ContractCreatedEvent | ContractUpdatedEvent | ContractDeletedEvent;

export class ContractEventFactory {
  public static createCreatedEvent(tenantId: string, entityId: string, actor: string, initialState: Record<string, any>): ContractCreatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'CONTRACT_CREATED',
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

  public static createUpdatedEvent(tenantId: string, entityId: string, actor: string, previousState: Record<string, any>, changes: Record<string, any>, version: number): ContractUpdatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'CONTRACT_UPDATED',
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

  public static createDeletedEvent(tenantId: string, entityId: string, actor: string, reason?: string): ContractDeletedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'CONTRACT_DELETED',
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
