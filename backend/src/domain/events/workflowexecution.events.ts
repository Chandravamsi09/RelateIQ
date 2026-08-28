/**
 * RelateIQ Domain Events: WorkflowExecutionEventTypes
 * Defines type-safe event payloads emitted during WorkflowExecution lifecycle transitions.
 */

export interface WorkflowExecutionBaseEvent {
  eventId: string;
  tenantId: string;
  entityId: string;
  timestamp: Date;
  actor: string;
  correlationId?: string;
  metadata?: Record<string, any>;
}

export interface WorkflowExecutionCreatedEvent extends WorkflowExecutionBaseEvent {
  eventType: 'WORKFLOWEXECUTION_CREATED';
  payload: {
    initialState: Record<string, any>;
    status: string;
  };
}

export interface WorkflowExecutionUpdatedEvent extends WorkflowExecutionBaseEvent {
  eventType: 'WORKFLOWEXECUTION_UPDATED';
  payload: {
    previousState: Record<string, any>;
    changes: Record<string, any>;
    version: number;
  };
}

export interface WorkflowExecutionDeletedEvent extends WorkflowExecutionBaseEvent {
  eventType: 'WORKFLOWEXECUTION_DELETED';
  payload: {
    reason?: string;
    deletedAt: Date;
  };
}

export type WorkflowExecutionDomainEvent = WorkflowExecutionCreatedEvent | WorkflowExecutionUpdatedEvent | WorkflowExecutionDeletedEvent;

export class WorkflowExecutionEventFactory {
  public static createCreatedEvent(tenantId: string, entityId: string, actor: string, initialState: Record<string, any>): WorkflowExecutionCreatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'WORKFLOWEXECUTION_CREATED',
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

  public static createUpdatedEvent(tenantId: string, entityId: string, actor: string, previousState: Record<string, any>, changes: Record<string, any>, version: number): WorkflowExecutionUpdatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'WORKFLOWEXECUTION_UPDATED',
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

  public static createDeletedEvent(tenantId: string, entityId: string, actor: string, reason?: string): WorkflowExecutionDeletedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'WORKFLOWEXECUTION_DELETED',
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
