/**
 * RelateIQ Domain Events: TaskEventTypes
 * Defines type-safe event payloads emitted during Task lifecycle transitions.
 */

export interface TaskBaseEvent {
  eventId: string;
  tenantId: string;
  entityId: string;
  timestamp: Date;
  actor: string;
  correlationId?: string;
  metadata?: Record<string, any>;
}

export interface TaskCreatedEvent extends TaskBaseEvent {
  eventType: 'TASK_CREATED';
  payload: {
    initialState: Record<string, any>;
    status: string;
  };
}

export interface TaskUpdatedEvent extends TaskBaseEvent {
  eventType: 'TASK_UPDATED';
  payload: {
    previousState: Record<string, any>;
    changes: Record<string, any>;
    version: number;
  };
}

export interface TaskDeletedEvent extends TaskBaseEvent {
  eventType: 'TASK_DELETED';
  payload: {
    reason?: string;
    deletedAt: Date;
  };
}

export type TaskDomainEvent = TaskCreatedEvent | TaskUpdatedEvent | TaskDeletedEvent;

export class TaskEventFactory {
  public static createCreatedEvent(tenantId: string, entityId: string, actor: string, initialState: Record<string, any>): TaskCreatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'TASK_CREATED',
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

  public static createUpdatedEvent(tenantId: string, entityId: string, actor: string, previousState: Record<string, any>, changes: Record<string, any>, version: number): TaskUpdatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'TASK_UPDATED',
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

  public static createDeletedEvent(tenantId: string, entityId: string, actor: string, reason?: string): TaskDeletedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'TASK_DELETED',
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
