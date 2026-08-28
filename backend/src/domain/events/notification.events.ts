/**
 * RelateIQ Domain Events: NotificationEventTypes
 * Defines type-safe event payloads emitted during Notification lifecycle transitions.
 */

export interface NotificationBaseEvent {
  eventId: string;
  tenantId: string;
  entityId: string;
  timestamp: Date;
  actor: string;
  correlationId?: string;
  metadata?: Record<string, any>;
}

export interface NotificationCreatedEvent extends NotificationBaseEvent {
  eventType: 'NOTIFICATION_CREATED';
  payload: {
    initialState: Record<string, any>;
    status: string;
  };
}

export interface NotificationUpdatedEvent extends NotificationBaseEvent {
  eventType: 'NOTIFICATION_UPDATED';
  payload: {
    previousState: Record<string, any>;
    changes: Record<string, any>;
    version: number;
  };
}

export interface NotificationDeletedEvent extends NotificationBaseEvent {
  eventType: 'NOTIFICATION_DELETED';
  payload: {
    reason?: string;
    deletedAt: Date;
  };
}

export type NotificationDomainEvent = NotificationCreatedEvent | NotificationUpdatedEvent | NotificationDeletedEvent;

export class NotificationEventFactory {
  public static createCreatedEvent(tenantId: string, entityId: string, actor: string, initialState: Record<string, any>): NotificationCreatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'NOTIFICATION_CREATED',
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

  public static createUpdatedEvent(tenantId: string, entityId: string, actor: string, previousState: Record<string, any>, changes: Record<string, any>, version: number): NotificationUpdatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'NOTIFICATION_UPDATED',
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

  public static createDeletedEvent(tenantId: string, entityId: string, actor: string, reason?: string): NotificationDeletedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'NOTIFICATION_DELETED',
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
