/**
 * RelateIQ Domain Events: SLAConfigEventTypes
 * Defines type-safe event payloads emitted during SLAConfig lifecycle transitions.
 */

export interface SLAConfigBaseEvent {
  eventId: string;
  tenantId: string;
  entityId: string;
  timestamp: Date;
  actor: string;
  correlationId?: string;
  metadata?: Record<string, any>;
}

export interface SLAConfigCreatedEvent extends SLAConfigBaseEvent {
  eventType: 'SLACONFIG_CREATED';
  payload: {
    initialState: Record<string, any>;
    status: string;
  };
}

export interface SLAConfigUpdatedEvent extends SLAConfigBaseEvent {
  eventType: 'SLACONFIG_UPDATED';
  payload: {
    previousState: Record<string, any>;
    changes: Record<string, any>;
    version: number;
  };
}

export interface SLAConfigDeletedEvent extends SLAConfigBaseEvent {
  eventType: 'SLACONFIG_DELETED';
  payload: {
    reason?: string;
    deletedAt: Date;
  };
}

export type SLAConfigDomainEvent = SLAConfigCreatedEvent | SLAConfigUpdatedEvent | SLAConfigDeletedEvent;

export class SLAConfigEventFactory {
  public static createCreatedEvent(tenantId: string, entityId: string, actor: string, initialState: Record<string, any>): SLAConfigCreatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'SLACONFIG_CREATED',
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

  public static createUpdatedEvent(tenantId: string, entityId: string, actor: string, previousState: Record<string, any>, changes: Record<string, any>, version: number): SLAConfigUpdatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'SLACONFIG_UPDATED',
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

  public static createDeletedEvent(tenantId: string, entityId: string, actor: string, reason?: string): SLAConfigDeletedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'SLACONFIG_DELETED',
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
