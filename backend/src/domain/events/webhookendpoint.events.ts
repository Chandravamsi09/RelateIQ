/**
 * RelateIQ Domain Events: WebhookEndpointEventTypes
 * Defines type-safe event payloads emitted during WebhookEndpoint lifecycle transitions.
 */

export interface WebhookEndpointBaseEvent {
  eventId: string;
  tenantId: string;
  entityId: string;
  timestamp: Date;
  actor: string;
  correlationId?: string;
  metadata?: Record<string, any>;
}

export interface WebhookEndpointCreatedEvent extends WebhookEndpointBaseEvent {
  eventType: 'WEBHOOKENDPOINT_CREATED';
  payload: {
    initialState: Record<string, any>;
    status: string;
  };
}

export interface WebhookEndpointUpdatedEvent extends WebhookEndpointBaseEvent {
  eventType: 'WEBHOOKENDPOINT_UPDATED';
  payload: {
    previousState: Record<string, any>;
    changes: Record<string, any>;
    version: number;
  };
}

export interface WebhookEndpointDeletedEvent extends WebhookEndpointBaseEvent {
  eventType: 'WEBHOOKENDPOINT_DELETED';
  payload: {
    reason?: string;
    deletedAt: Date;
  };
}

export type WebhookEndpointDomainEvent = WebhookEndpointCreatedEvent | WebhookEndpointUpdatedEvent | WebhookEndpointDeletedEvent;

export class WebhookEndpointEventFactory {
  public static createCreatedEvent(tenantId: string, entityId: string, actor: string, initialState: Record<string, any>): WebhookEndpointCreatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'WEBHOOKENDPOINT_CREATED',
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

  public static createUpdatedEvent(tenantId: string, entityId: string, actor: string, previousState: Record<string, any>, changes: Record<string, any>, version: number): WebhookEndpointUpdatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'WEBHOOKENDPOINT_UPDATED',
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

  public static createDeletedEvent(tenantId: string, entityId: string, actor: string, reason?: string): WebhookEndpointDeletedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'WEBHOOKENDPOINT_DELETED',
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
