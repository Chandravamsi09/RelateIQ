/**
 * RelateIQ Domain Events: DealEventTypes
 * Defines type-safe event payloads emitted during Deal lifecycle transitions.
 */

export interface DealBaseEvent {
  eventId: string;
  tenantId: string;
  entityId: string;
  timestamp: Date;
  actor: string;
  correlationId?: string;
  metadata?: Record<string, any>;
}

export interface DealCreatedEvent extends DealBaseEvent {
  eventType: 'DEAL_CREATED';
  payload: {
    initialState: Record<string, any>;
    status: string;
  };
}

export interface DealUpdatedEvent extends DealBaseEvent {
  eventType: 'DEAL_UPDATED';
  payload: {
    previousState: Record<string, any>;
    changes: Record<string, any>;
    version: number;
  };
}

export interface DealDeletedEvent extends DealBaseEvent {
  eventType: 'DEAL_DELETED';
  payload: {
    reason?: string;
    deletedAt: Date;
  };
}

export type DealDomainEvent = DealCreatedEvent | DealUpdatedEvent | DealDeletedEvent;

export class DealEventFactory {
  public static createCreatedEvent(tenantId: string, entityId: string, actor: string, initialState: Record<string, any>): DealCreatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'DEAL_CREATED',
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

  public static createUpdatedEvent(tenantId: string, entityId: string, actor: string, previousState: Record<string, any>, changes: Record<string, any>, version: number): DealUpdatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'DEAL_UPDATED',
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

  public static createDeletedEvent(tenantId: string, entityId: string, actor: string, reason?: string): DealDeletedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'DEAL_DELETED',
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
