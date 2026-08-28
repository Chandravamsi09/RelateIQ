import { UUID, PaginationParams, PaginatedResult } from '../../core/types/common.types';
import { NotFoundError, TenantIsolationError } from '../../core/errors/app-error';

export interface IBaseEntity {
  id: UUID;
  tenantId: UUID;
  createdAt: string | Date;
  updatedAt: string | Date;
  [key: string]: any;
}

export abstract class BaseRepository<T extends IBaseEntity> {
  protected items: Map<UUID, T> = new Map();
  protected entityName: string;

  constructor(entityName: string) {
    this.entityName = entityName;
  }

  public async findById(tenantId: UUID, id: UUID): Promise<T | null> {
    const item = this.items.get(id);
    if (!item) return null;
    if (item.tenantId !== tenantId) {
      throw new TenantIsolationError('Tenant isolation violation on ' + this.entityName + ' ' + id);
    }
    return { ...item };
  }

  public async getById(tenantId: UUID, id: UUID): Promise<T> {
    const item = await this.findById(tenantId, id);
    if (!item) {
      throw new NotFoundError(this.entityName + ' with id ' + id + ' not found');
    }
    return item;
  }

  public async create(tenantId: UUID, data: Omit<T, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'> & { id?: UUID }): Promise<T> {
    const id = data.id || ('uuid-' + Math.random().toString(36).substring(2, 11) + '-' + Date.now().toString(36));
    const now = new Date().toISOString();
    const entity: T = {
      ...(data as any),
      id,
      tenantId,
      createdAt: now,
      updatedAt: now
    };
    this.items.set(id, entity);
    return { ...entity };
  }

  public async update(tenantId: UUID, id: UUID, updates: Partial<Omit<T, 'id' | 'tenantId' | 'createdAt'>>): Promise<T> {
    const existing = await this.getById(tenantId, id);
    const updated: T = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.items.set(id, updated);
    return { ...updated };
  }

  public async delete(tenantId: UUID, id: UUID): Promise<boolean> {
    await this.getById(tenantId, id);
    return this.items.delete(id);
  }

  public async list(
    tenantId: UUID,
    params: PaginationParams = {},
    filter?: (item: T) => boolean
  ): Promise<PaginatedResult<T>> {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 20));
    const sortBy = params.sortBy || 'createdAt';
    const sortOrder = params.sortOrder || 'desc';

    let all = Array.from(this.items.values()).filter(item => item.tenantId === tenantId);
    if (filter) all = all.filter(filter);

    all.sort((a, b) => {
      const valA = a[sortBy];
      const valB = b[sortBy];
      if (valA === valB) return 0;
      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;
      const comp = valA > valB ? 1 : -1;
      return sortOrder === 'asc' ? comp : -comp;
    });

    const total = all.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedData = all.slice(startIndex, startIndex + limit).map(item => ({ ...item }));

    return {
      data: paginatedData,
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    };
  }

  public async count(tenantId: UUID, filter?: (item: T) => boolean): Promise<number> {
    let all = Array.from(this.items.values()).filter(item => item.tenantId === tenantId);
    if (filter) all = all.filter(filter);
    return all.length;
  }

  public clear(): void {
    this.items.clear();
  }
}
