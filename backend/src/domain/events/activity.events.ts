/**
 * RelateIQ Domain Events: ActivityEventTypes
 * Defines type-safe event payloads emitted during Activity lifecycle transitions.
 */

export interface ActivityBaseEvent {
  eventId: string;
  tenantId: string;
  entityId: string;
  timestamp: Date;
  actor: string;
  correlationId?: string;
  metadata?: Record<string, any>;
}

export interface ActivityCreatedEvent extends ActivityBaseEvent {
  eventType: 'ACTIVITY_CREATED';
  payload: {
    initialState: Record<string, any>;
    status: string;
  };
}

export interface ActivityUpdatedEvent extends ActivityBaseEvent {
  eventType: 'ACTIVITY_UPDATED';
  payload: {
    previousState: Record<string, any>;
    changes: Record<string, any>;
    version: number;
  };
}

export interface ActivityDeletedEvent extends ActivityBaseEvent {
  eventType: 'ACTIVITY_DELETED';
  payload: {
    reason?: string;
    deletedAt: Date;
  };
}

export type ActivityDomainEvent = ActivityCreatedEvent | ActivityUpdatedEvent | ActivityDeletedEvent;

export class ActivityEventFactory {
  public static createCreatedEvent(tenantId: string, entityId: string, actor: string, initialState: Record<string, any>): ActivityCreatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'ACTIVITY_CREATED',
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

  public static createUpdatedEvent(tenantId: string, entityId: string, actor: string, previousState: Record<string, any>, changes: Record<string, any>, version: number): ActivityUpdatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'ACTIVITY_UPDATED',
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

  public static createDeletedEvent(tenantId: string, entityId: string, actor: string, reason?: string): ActivityDeletedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'ACTIVITY_DELETED',
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
