/**
 * RelateIQ Domain Events: MeetingEventTypes
 * Defines type-safe event payloads emitted during Meeting lifecycle transitions.
 */

export interface MeetingBaseEvent {
  eventId: string;
  tenantId: string;
  entityId: string;
  timestamp: Date;
  actor: string;
  correlationId?: string;
  metadata?: Record<string, any>;
}

export interface MeetingCreatedEvent extends MeetingBaseEvent {
  eventType: 'MEETING_CREATED';
  payload: {
    initialState: Record<string, any>;
    status: string;
  };
}

export interface MeetingUpdatedEvent extends MeetingBaseEvent {
  eventType: 'MEETING_UPDATED';
  payload: {
    previousState: Record<string, any>;
    changes: Record<string, any>;
    version: number;
  };
}

export interface MeetingDeletedEvent extends MeetingBaseEvent {
  eventType: 'MEETING_DELETED';
  payload: {
    reason?: string;
    deletedAt: Date;
  };
}

export type MeetingDomainEvent = MeetingCreatedEvent | MeetingUpdatedEvent | MeetingDeletedEvent;

export class MeetingEventFactory {
  public static createCreatedEvent(tenantId: string, entityId: string, actor: string, initialState: Record<string, any>): MeetingCreatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'MEETING_CREATED',
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

  public static createUpdatedEvent(tenantId: string, entityId: string, actor: string, previousState: Record<string, any>, changes: Record<string, any>, version: number): MeetingUpdatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'MEETING_UPDATED',
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

  public static createDeletedEvent(tenantId: string, entityId: string, actor: string, reason?: string): MeetingDeletedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'MEETING_DELETED',
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
