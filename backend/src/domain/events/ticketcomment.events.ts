/**
 * RelateIQ Domain Events: TicketCommentEventTypes
 * Defines type-safe event payloads emitted during TicketComment lifecycle transitions.
 */

export interface TicketCommentBaseEvent {
  eventId: string;
  tenantId: string;
  entityId: string;
  timestamp: Date;
  actor: string;
  correlationId?: string;
  metadata?: Record<string, any>;
}

export interface TicketCommentCreatedEvent extends TicketCommentBaseEvent {
  eventType: 'TICKETCOMMENT_CREATED';
  payload: {
    initialState: Record<string, any>;
    status: string;
  };
}

export interface TicketCommentUpdatedEvent extends TicketCommentBaseEvent {
  eventType: 'TICKETCOMMENT_UPDATED';
  payload: {
    previousState: Record<string, any>;
    changes: Record<string, any>;
    version: number;
  };
}

export interface TicketCommentDeletedEvent extends TicketCommentBaseEvent {
  eventType: 'TICKETCOMMENT_DELETED';
  payload: {
    reason?: string;
    deletedAt: Date;
  };
}

export type TicketCommentDomainEvent = TicketCommentCreatedEvent | TicketCommentUpdatedEvent | TicketCommentDeletedEvent;

export class TicketCommentEventFactory {
  public static createCreatedEvent(tenantId: string, entityId: string, actor: string, initialState: Record<string, any>): TicketCommentCreatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'TICKETCOMMENT_CREATED',
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

  public static createUpdatedEvent(tenantId: string, entityId: string, actor: string, previousState: Record<string, any>, changes: Record<string, any>, version: number): TicketCommentUpdatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'TICKETCOMMENT_UPDATED',
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

  public static createDeletedEvent(tenantId: string, entityId: string, actor: string, reason?: string): TicketCommentDeletedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'TICKETCOMMENT_DELETED',
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
