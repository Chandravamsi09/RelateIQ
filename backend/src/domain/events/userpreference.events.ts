/**
 * RelateIQ Domain Events: UserPreferenceEventTypes
 * Defines type-safe event payloads emitted during UserPreference lifecycle transitions.
 */

export interface UserPreferenceBaseEvent {
  eventId: string;
  tenantId: string;
  entityId: string;
  timestamp: Date;
  actor: string;
  correlationId?: string;
  metadata?: Record<string, any>;
}

export interface UserPreferenceCreatedEvent extends UserPreferenceBaseEvent {
  eventType: 'USERPREFERENCE_CREATED';
  payload: {
    initialState: Record<string, any>;
    status: string;
  };
}

export interface UserPreferenceUpdatedEvent extends UserPreferenceBaseEvent {
  eventType: 'USERPREFERENCE_UPDATED';
  payload: {
    previousState: Record<string, any>;
    changes: Record<string, any>;
    version: number;
  };
}

export interface UserPreferenceDeletedEvent extends UserPreferenceBaseEvent {
  eventType: 'USERPREFERENCE_DELETED';
  payload: {
    reason?: string;
    deletedAt: Date;
  };
}

export type UserPreferenceDomainEvent = UserPreferenceCreatedEvent | UserPreferenceUpdatedEvent | UserPreferenceDeletedEvent;

export class UserPreferenceEventFactory {
  public static createCreatedEvent(tenantId: string, entityId: string, actor: string, initialState: Record<string, any>): UserPreferenceCreatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'USERPREFERENCE_CREATED',
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

  public static createUpdatedEvent(tenantId: string, entityId: string, actor: string, previousState: Record<string, any>, changes: Record<string, any>, version: number): UserPreferenceUpdatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'USERPREFERENCE_UPDATED',
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

  public static createDeletedEvent(tenantId: string, entityId: string, actor: string, reason?: string): UserPreferenceDeletedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'USERPREFERENCE_DELETED',
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
