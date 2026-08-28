/**
 * RelateIQ Domain Events: TicketEventTypes
 * Defines type-safe event payloads emitted during Ticket lifecycle transitions.
 */

export interface TicketBaseEvent {
  eventId: string;
  tenantId: string;
  entityId: string;
  timestamp: Date;
  actor: string;
  correlationId?: string;
  metadata?: Record<string, any>;
}

export interface TicketCreatedEvent extends TicketBaseEvent {
  eventType: 'TICKET_CREATED';
  payload: {
    initialState: Record<string, any>;
    status: string;
  };
}

export interface TicketUpdatedEvent extends TicketBaseEvent {
  eventType: 'TICKET_UPDATED';
  payload: {
    previousState: Record<string, any>;
    changes: Record<string, any>;
    version: number;
  };
}

export interface TicketDeletedEvent extends TicketBaseEvent {
  eventType: 'TICKET_DELETED';
  payload: {
    reason?: string;
    deletedAt: Date;
  };
}

export type TicketDomainEvent = TicketCreatedEvent | TicketUpdatedEvent | TicketDeletedEvent;

export class TicketEventFactory {
  public static createCreatedEvent(tenantId: string, entityId: string, actor: string, initialState: Record<string, any>): TicketCreatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'TICKET_CREATED',
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

  public static createUpdatedEvent(tenantId: string, entityId: string, actor: string, previousState: Record<string, any>, changes: Record<string, any>, version: number): TicketUpdatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'TICKET_UPDATED',
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

  public static createDeletedEvent(tenantId: string, entityId: string, actor: string, reason?: string): TicketDeletedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'TICKET_DELETED',
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
