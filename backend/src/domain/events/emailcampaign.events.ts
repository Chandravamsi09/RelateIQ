/**
 * RelateIQ Domain Events: EmailCampaignEventTypes
 * Defines type-safe event payloads emitted during EmailCampaign lifecycle transitions.
 */

export interface EmailCampaignBaseEvent {
  eventId: string;
  tenantId: string;
  entityId: string;
  timestamp: Date;
  actor: string;
  correlationId?: string;
  metadata?: Record<string, any>;
}

export interface EmailCampaignCreatedEvent extends EmailCampaignBaseEvent {
  eventType: 'EMAILCAMPAIGN_CREATED';
  payload: {
    initialState: Record<string, any>;
    status: string;
  };
}

export interface EmailCampaignUpdatedEvent extends EmailCampaignBaseEvent {
  eventType: 'EMAILCAMPAIGN_UPDATED';
  payload: {
    previousState: Record<string, any>;
    changes: Record<string, any>;
    version: number;
  };
}

export interface EmailCampaignDeletedEvent extends EmailCampaignBaseEvent {
  eventType: 'EMAILCAMPAIGN_DELETED';
  payload: {
    reason?: string;
    deletedAt: Date;
  };
}

export type EmailCampaignDomainEvent = EmailCampaignCreatedEvent | EmailCampaignUpdatedEvent | EmailCampaignDeletedEvent;

export class EmailCampaignEventFactory {
  public static createCreatedEvent(tenantId: string, entityId: string, actor: string, initialState: Record<string, any>): EmailCampaignCreatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'EMAILCAMPAIGN_CREATED',
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

  public static createUpdatedEvent(tenantId: string, entityId: string, actor: string, previousState: Record<string, any>, changes: Record<string, any>, version: number): EmailCampaignUpdatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'EMAILCAMPAIGN_UPDATED',
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

  public static createDeletedEvent(tenantId: string, entityId: string, actor: string, reason?: string): EmailCampaignDeletedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'EMAILCAMPAIGN_DELETED',
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
