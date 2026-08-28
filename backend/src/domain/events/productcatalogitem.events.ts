/**
 * RelateIQ Domain Events: ProductCatalogItemEventTypes
 * Defines type-safe event payloads emitted during ProductCatalogItem lifecycle transitions.
 */

export interface ProductCatalogItemBaseEvent {
  eventId: string;
  tenantId: string;
  entityId: string;
  timestamp: Date;
  actor: string;
  correlationId?: string;
  metadata?: Record<string, any>;
}

export interface ProductCatalogItemCreatedEvent extends ProductCatalogItemBaseEvent {
  eventType: 'PRODUCTCATALOGITEM_CREATED';
  payload: {
    initialState: Record<string, any>;
    status: string;
  };
}

export interface ProductCatalogItemUpdatedEvent extends ProductCatalogItemBaseEvent {
  eventType: 'PRODUCTCATALOGITEM_UPDATED';
  payload: {
    previousState: Record<string, any>;
    changes: Record<string, any>;
    version: number;
  };
}

export interface ProductCatalogItemDeletedEvent extends ProductCatalogItemBaseEvent {
  eventType: 'PRODUCTCATALOGITEM_DELETED';
  payload: {
    reason?: string;
    deletedAt: Date;
  };
}

export type ProductCatalogItemDomainEvent = ProductCatalogItemCreatedEvent | ProductCatalogItemUpdatedEvent | ProductCatalogItemDeletedEvent;

export class ProductCatalogItemEventFactory {
  public static createCreatedEvent(tenantId: string, entityId: string, actor: string, initialState: Record<string, any>): ProductCatalogItemCreatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'PRODUCTCATALOGITEM_CREATED',
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

  public static createUpdatedEvent(tenantId: string, entityId: string, actor: string, previousState: Record<string, any>, changes: Record<string, any>, version: number): ProductCatalogItemUpdatedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'PRODUCTCATALOGITEM_UPDATED',
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

  public static createDeletedEvent(tenantId: string, entityId: string, actor: string, reason?: string): ProductCatalogItemDeletedEvent {
    return {
      eventId: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      eventType: 'PRODUCTCATALOGITEM_DELETED',
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
