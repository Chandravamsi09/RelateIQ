/**
 * RelateIQ Domain Events: LeadEventTypes
 * Defines type-safe event payloads emitted during Lead lifecycle transitions.
 */

export interface LeadBaseEvent {
  eventId: string;
  tenantId: string;
  entityId: string;
  timestamp: Date;
  actor: string;
  correlationId?: string;
  metadata?: Record<string, any>;
}

export interface LeadCreatedEvent extends LeadBaseEvent {
  eventType: 'LEAD_CREATED';
  payload: {
    initialState: Record<string, any>;
    status: string;
  };
}

export interface LeadUpdatedEvent extends LeadBaseEvent {
  eventType: 'LEAD_UPDATED';
  payload: {
    previousState: Record<string, any>;
    changes: Record<string, any>;
    version: number;
  };
}

export interface LeadDeletedEvent extends LeadBaseEvent {
  eventType: 'LEAD_DELETED';
  payload: {
    reason?: string;
    deletedAt: Date;
  };
}

export type LeadDomainEvent = LeadCreatedEvent | LeadUpdatedEvent | LeadDeletedEvent;

export class LeadEventFactory {
  public static createCreatedEvent(tenantId: string, entityId: string, actor: string, initialState: Record<string, any>): LeadCreatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'LEAD_CREATED',
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

  public static createUpdatedEvent(tenantId: string, entityId: string, actor: string, previousState: Record<string, any>, changes: Record<string, any>, version: number): LeadUpdatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'LEAD_UPDATED',
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

  public static createDeletedEvent(tenantId: string, entityId: string, actor: string, reason?: string): LeadDeletedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'LEAD_DELETED',
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
