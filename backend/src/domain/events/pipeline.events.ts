/**
 * RelateIQ Domain Events: PipelineEventTypes
 * Defines type-safe event payloads emitted during Pipeline lifecycle transitions.
 */

export interface PipelineBaseEvent {
  eventId: string;
  tenantId: string;
  entityId: string;
  timestamp: Date;
  actor: string;
  correlationId?: string;
  metadata?: Record<string, any>;
}

export interface PipelineCreatedEvent extends PipelineBaseEvent {
  eventType: 'PIPELINE_CREATED';
  payload: {
    initialState: Record<string, any>;
    status: string;
  };
}

export interface PipelineUpdatedEvent extends PipelineBaseEvent {
  eventType: 'PIPELINE_UPDATED';
  payload: {
    previousState: Record<string, any>;
    changes: Record<string, any>;
    version: number;
  };
}

export interface PipelineDeletedEvent extends PipelineBaseEvent {
  eventType: 'PIPELINE_DELETED';
  payload: {
    reason?: string;
    deletedAt: Date;
  };
}

export type PipelineDomainEvent = PipelineCreatedEvent | PipelineUpdatedEvent | PipelineDeletedEvent;

export class PipelineEventFactory {
  public static createCreatedEvent(tenantId: string, entityId: string, actor: string, initialState: Record<string, any>): PipelineCreatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'PIPELINE_CREATED',
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

  public static createUpdatedEvent(tenantId: string, entityId: string, actor: string, previousState: Record<string, any>, changes: Record<string, any>, version: number): PipelineUpdatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'PIPELINE_UPDATED',
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

  public static createDeletedEvent(tenantId: string, entityId: string, actor: string, reason?: string): PipelineDeletedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'PIPELINE_DELETED',
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
