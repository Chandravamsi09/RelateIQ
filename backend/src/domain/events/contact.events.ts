/**
 * RelateIQ Domain Events: ContactEventTypes
 * Defines type-safe event payloads emitted during Contact lifecycle transitions.
 */

export interface ContactBaseEvent {
  eventId: string;
  tenantId: string;
  entityId: string;
  timestamp: Date;
  actor: string;
  correlationId?: string;
  metadata?: Record<string, any>;
}

export interface ContactCreatedEvent extends ContactBaseEvent {
  eventType: 'CONTACT_CREATED';
  payload: {
    initialState: Record<string, any>;
    status: string;
  };
}

export interface ContactUpdatedEvent extends ContactBaseEvent {
  eventType: 'CONTACT_UPDATED';
  payload: {
    previousState: Record<string, any>;
    changes: Record<string, any>;
    version: number;
  };
}

export interface ContactDeletedEvent extends ContactBaseEvent {
  eventType: 'CONTACT_DELETED';
  payload: {
    reason?: string;
    deletedAt: Date;
  };
}

export type ContactDomainEvent = ContactCreatedEvent | ContactUpdatedEvent | ContactDeletedEvent;

export class ContactEventFactory {
  public static createCreatedEvent(tenantId: string, entityId: string, actor: string, initialState: Record<string, any>): ContactCreatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'CONTACT_CREATED',
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

  public static createUpdatedEvent(tenantId: string, entityId: string, actor: string, previousState: Record<string, any>, changes: Record<string, any>, version: number): ContactUpdatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'CONTACT_UPDATED',
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

  public static createDeletedEvent(tenantId: string, entityId: string, actor: string, reason?: string): ContactDeletedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'CONTACT_DELETED',
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
