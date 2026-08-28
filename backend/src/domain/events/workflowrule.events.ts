/**
 * RelateIQ Domain Events: WorkflowRuleEventTypes
 * Defines type-safe event payloads emitted during WorkflowRule lifecycle transitions.
 */

export interface WorkflowRuleBaseEvent {
  eventId: string;
  tenantId: string;
  entityId: string;
  timestamp: Date;
  actor: string;
  correlationId?: string;
  metadata?: Record<string, any>;
}

export interface WorkflowRuleCreatedEvent extends WorkflowRuleBaseEvent {
  eventType: 'WORKFLOWRULE_CREATED';
  payload: {
    initialState: Record<string, any>;
    status: string;
  };
}

export interface WorkflowRuleUpdatedEvent extends WorkflowRuleBaseEvent {
  eventType: 'WORKFLOWRULE_UPDATED';
  payload: {
    previousState: Record<string, any>;
    changes: Record<string, any>;
    version: number;
  };
}

export interface WorkflowRuleDeletedEvent extends WorkflowRuleBaseEvent {
  eventType: 'WORKFLOWRULE_DELETED';
  payload: {
    reason?: string;
    deletedAt: Date;
  };
}

export type WorkflowRuleDomainEvent = WorkflowRuleCreatedEvent | WorkflowRuleUpdatedEvent | WorkflowRuleDeletedEvent;

export class WorkflowRuleEventFactory {
  public static createCreatedEvent(tenantId: string, entityId: string, actor: string, initialState: Record<string, any>): WorkflowRuleCreatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'WORKFLOWRULE_CREATED',
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

  public static createUpdatedEvent(tenantId: string, entityId: string, actor: string, previousState: Record<string, any>, changes: Record<string, any>, version: number): WorkflowRuleUpdatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'WORKFLOWRULE_UPDATED',
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

  public static createDeletedEvent(tenantId: string, entityId: string, actor: string, reason?: string): WorkflowRuleDeletedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'WORKFLOWRULE_DELETED',
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
