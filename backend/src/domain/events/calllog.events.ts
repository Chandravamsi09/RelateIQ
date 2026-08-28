/**
 * RelateIQ Domain Events: CallLogEventTypes
 * Defines type-safe event payloads emitted during CallLog lifecycle transitions.
 */

export interface CallLogBaseEvent {
  eventId: string;
  tenantId: string;
  entityId: string;
  timestamp: Date;
  actor: string;
  correlationId?: string;
  metadata?: Record<string, any>;
}

export interface CallLogCreatedEvent extends CallLogBaseEvent {
  eventType: 'CALLLOG_CREATED';
  payload: {
    initialState: Record<string, any>;
    status: string;
  };
}

export interface CallLogUpdatedEvent extends CallLogBaseEvent {
  eventType: 'CALLLOG_UPDATED';
  payload: {
    previousState: Record<string, any>;
    changes: Record<string, any>;
    version: number;
  };
}

export interface CallLogDeletedEvent extends CallLogBaseEvent {
  eventType: 'CALLLOG_DELETED';
  payload: {
    reason?: string;
    deletedAt: Date;
  };
}

export type CallLogDomainEvent = CallLogCreatedEvent | CallLogUpdatedEvent | CallLogDeletedEvent;

export class CallLogEventFactory {
  public static createCreatedEvent(tenantId: string, entityId: string, actor: string, initialState: Record<string, any>): CallLogCreatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'CALLLOG_CREATED',
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

  public static createUpdatedEvent(tenantId: string, entityId: string, actor: string, previousState: Record<string, any>, changes: Record<string, any>, version: number): CallLogUpdatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'CALLLOG_UPDATED',
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

  public static createDeletedEvent(tenantId: string, entityId: string, actor: string, reason?: string): CallLogDeletedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'CALLLOG_DELETED',
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
