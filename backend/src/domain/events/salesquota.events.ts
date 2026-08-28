/**
 * RelateIQ Domain Events: SalesQuotaEventTypes
 * Defines type-safe event payloads emitted during SalesQuota lifecycle transitions.
 */

export interface SalesQuotaBaseEvent {
  eventId: string;
  tenantId: string;
  entityId: string;
  timestamp: Date;
  actor: string;
  correlationId?: string;
  metadata?: Record<string, any>;
}

export interface SalesQuotaCreatedEvent extends SalesQuotaBaseEvent {
  eventType: 'SALESQUOTA_CREATED';
  payload: {
    initialState: Record<string, any>;
    status: string;
  };
}

export interface SalesQuotaUpdatedEvent extends SalesQuotaBaseEvent {
  eventType: 'SALESQUOTA_UPDATED';
  payload: {
    previousState: Record<string, any>;
    changes: Record<string, any>;
    version: number;
  };
}

export interface SalesQuotaDeletedEvent extends SalesQuotaBaseEvent {
  eventType: 'SALESQUOTA_DELETED';
  payload: {
    reason?: string;
    deletedAt: Date;
  };
}

export type SalesQuotaDomainEvent = SalesQuotaCreatedEvent | SalesQuotaUpdatedEvent | SalesQuotaDeletedEvent;

export class SalesQuotaEventFactory {
  public static createCreatedEvent(tenantId: string, entityId: string, actor: string, initialState: Record<string, any>): SalesQuotaCreatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'SALESQUOTA_CREATED',
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

  public static createUpdatedEvent(tenantId: string, entityId: string, actor: string, previousState: Record<string, any>, changes: Record<string, any>, version: number): SalesQuotaUpdatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'SALESQUOTA_UPDATED',
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

  public static createDeletedEvent(tenantId: string, entityId: string, actor: string, reason?: string): SalesQuotaDeletedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'SALESQUOTA_DELETED',
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
