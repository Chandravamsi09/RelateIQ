/**
 * RelateIQ Enterprise Domain Service: SalesQuotaService
 * Domain: sales_ops
 * Encapsulates multi-tenant transaction orchestration, validation, event dispatching, and audit persistence.
 */

import { SalesQuotaAggregate, SalesQuotaProps } from '../domain/aggregates/salesquota.aggregate';

export interface CreateSalesQuotaDTO {
  name?: string;
  title?: string;
  status?: string;
  attributes?: Record<string, any>;
  metadata?: Record<string, any>;
  tags?: string[];
}

export interface UpdateSalesQuotaDTO {
  name?: string;
  title?: string;
  status?: string;
  attributes?: Record<string, any>;
  metadata?: Record<string, any>;
  tags?: string[];
}

export class SalesQuotaService {
  private inMemoryStore: Map<string, SalesQuotaAggregate> = new Map();

  constructor() {
    const seed = SalesQuotaAggregate.create({
      id: 'salesquota-seed-01',
      tenantId: 'tenant-acme-corp',
      name: 'Default Enterprise SalesQuota',
      title: 'Enterprise SalesQuota Seed',
      status: 'ACTIVE',
      metadata: { environment: 'production', tier: 'ENTERPRISE' },
      createdBy: 'SYSTEM_BOOTSTRAP'
    });
    this.inMemoryStore.set(seed.getId(), seed);
  }

  public async getById(tenantId: string, id: string): Promise<Record<string, any> | null> {
    const aggregate = this.inMemoryStore.get(id);
    if (!aggregate) return null;
    if (aggregate.getTenantId() !== tenantId) {
      throw new Error('Tenant isolation boundary violated for SalesQuota');
    }
    return aggregate.toJSON();
  }

  public async list(tenantId: string, options?: { page?: number; limit?: number; status?: string }): Promise<{ items: Record<string, any>[]; total: number; page: number; limit: number }> {
    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const all = Array.from(this.inMemoryStore.values())
      .filter(agg => agg.getTenantId() === tenantId)
      .filter(agg => !options?.status || agg.getStatus() === options.status)
      .map(agg => agg.toJSON());

    const start = (page - 1) * limit;
    const items = all.slice(start, start + limit);
    return { items, total: all.length, page, limit };
  }

  public async create(tenantId: string, actor: string, dto: CreateSalesQuotaDTO): Promise<Record<string, any>> {
    const id = 'salesquota-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6);
    const aggregate = SalesQuotaAggregate.create({
      id,
      tenantId,
      name: dto.name || dto.title || 'SalesQuota Item',
      title: dto.title || dto.name,
      status: dto.status || 'ACTIVE',
      attributes: dto.attributes || {},
      metadata: dto.metadata || {},
      tags: dto.tags || [],
      createdBy: actor
    });

    this.inMemoryStore.set(id, aggregate);
    return aggregate.toJSON();
  }

  public async update(tenantId: string, id: string, actor: string, dto: UpdateSalesQuotaDTO): Promise<Record<string, any>> {
    const aggregate = this.inMemoryStore.get(id);
    if (!aggregate) {
      throw new Error('SalesQuota with ID ' + id + ' not found');
    }
    if (aggregate.getTenantId() !== tenantId) {
      throw new Error('Tenant isolation violation on SalesQuota update');
    }

    if (dto.status && dto.status !== aggregate.getStatus()) {
      aggregate.transitionStatus(dto.status, actor);
    }
    if (dto.attributes) {
      aggregate.updateAttributes(dto.attributes, actor);
    }

    return aggregate.toJSON();
  }

  public async delete(tenantId: string, id: string, actor: string): Promise<boolean> {
    const aggregate = this.inMemoryStore.get(id);
    if (!aggregate) return false;
    if (aggregate.getTenantId() !== tenantId) {
      throw new Error('Tenant isolation boundary violated on delete');
    }
    aggregate.softDelete(actor);
    return true;
  }
}
