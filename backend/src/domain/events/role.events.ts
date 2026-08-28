/**
 * RelateIQ Domain Events: RoleEventTypes
 * Defines type-safe event payloads emitted during Role lifecycle transitions.
 */

export interface RoleBaseEvent {
  eventId: string;
  tenantId: string;
  entityId: string;
  timestamp: Date;
  actor: string;
  correlationId?: string;
  metadata?: Record<string, any>;
}

export interface RoleCreatedEvent extends RoleBaseEvent {
  eventType: 'ROLE_CREATED';
  payload: {
    initialState: Record<string, any>;
    status: string;
  };
}

export interface RoleUpdatedEvent extends RoleBaseEvent {
  eventType: 'ROLE_UPDATED';
  payload: {
    previousState: Record<string, any>;
    changes: Record<string, any>;
    version: number;
  };
}

export interface RoleDeletedEvent extends RoleBaseEvent {
  eventType: 'ROLE_DELETED';
  payload: {
    reason?: string;
    deletedAt: Date;
  };
}

export type RoleDomainEvent = RoleCreatedEvent | RoleUpdatedEvent | RoleDeletedEvent;

export class RoleEventFactory {
  public static createCreatedEvent(tenantId: string, entityId: string, actor: string, initialState: Record<string, any>): RoleCreatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'ROLE_CREATED',
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

  public static createUpdatedEvent(tenantId: string, entityId: string, actor: string, previousState: Record<string, any>, changes: Record<string, any>, version: number): RoleUpdatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'ROLE_UPDATED',
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

  public static createDeletedEvent(tenantId: string, entityId: string, actor: string, reason?: string): RoleDeletedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'ROLE_DELETED',
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
