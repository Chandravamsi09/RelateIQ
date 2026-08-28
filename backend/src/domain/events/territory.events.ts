/**
 * RelateIQ Domain Events: TerritoryEventTypes
 * Defines type-safe event payloads emitted during Territory lifecycle transitions.
 */

export interface TerritoryBaseEvent {
  eventId: string;
  tenantId: string;
  entityId: string;
  timestamp: Date;
  actor: string;
  correlationId?: string;
  metadata?: Record<string, any>;
}

export interface TerritoryCreatedEvent extends TerritoryBaseEvent {
  eventType: 'TERRITORY_CREATED';
  payload: {
    initialState: Record<string, any>;
    status: string;
  };
}

export interface TerritoryUpdatedEvent extends TerritoryBaseEvent {
  eventType: 'TERRITORY_UPDATED';
  payload: {
    previousState: Record<string, any>;
    changes: Record<string, any>;
    version: number;
  };
}

export interface TerritoryDeletedEvent extends TerritoryBaseEvent {
  eventType: 'TERRITORY_DELETED';
  payload: {
    reason?: string;
    deletedAt: Date;
  };
}

export type TerritoryDomainEvent = TerritoryCreatedEvent | TerritoryUpdatedEvent | TerritoryDeletedEvent;

export class TerritoryEventFactory {
  public static createCreatedEvent(tenantId: string, entityId: string, actor: string, initialState: Record<string, any>): TerritoryCreatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'TERRITORY_CREATED',
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

  public static createUpdatedEvent(tenantId: string, entityId: string, actor: string, previousState: Record<string, any>, changes: Record<string, any>, version: number): TerritoryUpdatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'TERRITORY_UPDATED',
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

  public static createDeletedEvent(tenantId: string, entityId: string, actor: string, reason?: string): TerritoryDeletedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'TERRITORY_DELETED',
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
