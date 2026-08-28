/**
 * RelateIQ Domain Events: TenantEventTypes
 * Defines type-safe event payloads emitted during Tenant lifecycle transitions.
 */

export interface TenantBaseEvent {
  eventId: string;
  tenantId: string;
  entityId: string;
  timestamp: Date;
  actor: string;
  correlationId?: string;
  metadata?: Record<string, any>;
}

export interface TenantCreatedEvent extends TenantBaseEvent {
  eventType: 'TENANT_CREATED';
  payload: {
    initialState: Record<string, any>;
    status: string;
  };
}

export interface TenantUpdatedEvent extends TenantBaseEvent {
  eventType: 'TENANT_UPDATED';
  payload: {
    previousState: Record<string, any>;
    changes: Record<string, any>;
    version: number;
  };
}

export interface TenantDeletedEvent extends TenantBaseEvent {
  eventType: 'TENANT_DELETED';
  payload: {
    reason?: string;
    deletedAt: Date;
  };
}

export type TenantDomainEvent = TenantCreatedEvent | TenantUpdatedEvent | TenantDeletedEvent;

export class TenantEventFactory {
  public static createCreatedEvent(tenantId: string, entityId: string, actor: string, initialState: Record<string, any>): TenantCreatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'TENANT_CREATED',
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

  public static createUpdatedEvent(tenantId: string, entityId: string, actor: string, previousState: Record<string, any>, changes: Record<string, any>, version: number): TenantUpdatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'TENANT_UPDATED',
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

  public static createDeletedEvent(tenantId: string, entityId: string, actor: string, reason?: string): TenantDeletedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'TENANT_DELETED',
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
