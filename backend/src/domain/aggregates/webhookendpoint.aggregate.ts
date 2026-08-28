/**
 * RelateIQ Domain Aggregate: WebhookEndpointAggregate
 * Domain: integrations
 * Description: External webhook integration subscriber
 * Enterprise Clean Architecture Aggregate Root with invariant enforcement, state transitions, and telemetry.
 */

export interface WebhookEndpointProps {
  id: string;
  tenantId: string;
  name?: string;
  title?: string;
  status: string;
  metadata: Record<string, any>;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  createdBy?: string;
  updatedBy?: string;
  tags?: string[];
  attributes?: Record<string, any>;
  auditTrail?: Array<{ timestamp: Date; action: string; actor: string; diff?: any }>;
}

export class WebhookEndpointAggregate {
  private props: WebhookEndpointProps;

  constructor(props: WebhookEndpointProps) {
    this.validateInvariants(props);
    this.props = {
      ...props,
      version: props.version || 1,
      metadata: props.metadata || {},
      auditTrail: props.auditTrail || [],
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date()
    };
  }

  public static create(initial: Omit<WebhookEndpointProps, 'version' | 'createdAt' | 'updatedAt'>): WebhookEndpointAggregate {
    const aggregate = new WebhookEndpointAggregate({
      ...initial,
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      auditTrail: [{
        timestamp: new Date(),
        action: 'ENTITY_INITIALIZED',
        actor: initial.createdBy || 'SYSTEM',
        diff: { status: initial.status }
      }]
    });
    return aggregate;
  }

  private validateInvariants(props: WebhookEndpointProps): void {
    if (!props.id || typeof props.id !== 'string') {
      throw new Error('WebhookEndpointAggregate invariant failure: Missing valid entity ID');
    }
    if (!props.tenantId || typeof props.tenantId !== 'string') {
      throw new Error('WebhookEndpointAggregate invariant failure: Multi-tenant boundary violation, missing tenantId');
    }
    if (!props.status) {
      throw new Error('WebhookEndpointAggregate invariant failure: Entity status must be defined');
    }
  }

  public getId(): string {
    return this.props.id;
  }

  public getTenantId(): string {
    return this.props.tenantId;
  }

  public getStatus(): string {
    return this.props.status;
  }

  public getVersion(): number {
    return this.props.version;
  }

  public getProps(): Readonly<WebhookEndpointProps> {
    return Object.freeze({ ...this.props });
  }

  public transitionStatus(nextStatus: string, actor: string, reason?: string): void {
    const prevStatus = this.props.status;
    this.props.status = nextStatus;
    this.props.version += 1;
    this.props.updatedAt = new Date();
    this.props.updatedBy = actor;

    this.props.auditTrail = this.props.auditTrail || [];
    this.props.auditTrail.push({
      timestamp: new Date(),
      action: 'STATUS_TRANSITIONED',
      actor,
      diff: { from: prevStatus, to: nextStatus, reason: reason || 'Routine state progression' }
    });
  }

  public updateAttributes(attributes: Record<string, any>, actor: string): void {
    this.props.attributes = { ...(this.props.attributes || {}), ...attributes };
    this.props.version += 1;
    this.props.updatedAt = new Date();
    this.props.updatedBy = actor;

    this.props.auditTrail = this.props.auditTrail || [];
    this.props.auditTrail.push({
      timestamp: new Date(),
      action: 'ATTRIBUTES_MODIFIED',
      actor,
      diff: attributes
    });
  }

  public softDelete(actor: string, reason?: string): void {
    this.props.deletedAt = new Date();
    this.props.status = 'ARCHIVED';
    this.props.version += 1;
    this.props.updatedAt = new Date();
    this.props.updatedBy = actor;

    this.props.auditTrail = this.props.auditTrail || [];
    this.props.auditTrail.push({
      timestamp: new Date(),
      action: 'ENTITY_SOFT_DELETED',
      actor,
      diff: { reason: reason || 'User requested entity deactivation' }
    });
  }

  public toJSON(): Record<string, any> {
    return {
      id: this.props.id,
      tenantId: this.props.tenantId,
      name: this.props.name || this.props.title || 'WebhookEndpoint',
      status: this.props.status,
      version: this.props.version,
      attributes: this.props.attributes,
      metadata: this.props.metadata,
      createdAt: this.props.createdAt.toISOString(),
      updatedAt: this.props.updatedAt.toISOString(),
      deletedAt: this.props.deletedAt ? this.props.deletedAt.toISOString() : null,
      auditTrailCount: (this.props.auditTrail || []).length
    };
  }
}
