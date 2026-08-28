import { TenantRepository, ITenantEntity } from '../../database/repositories/crm.repositories';
import { UUID, PaginationParams, PaginatedResult } from '../../core/types/common.types';
import { NotFoundError, ConflictError, ValidationError } from '../../core/errors/app-error';

export class TenantService {
  constructor(private tenantRepo: TenantRepository) {}

  public async getTenantById(tenantId: UUID): Promise<ITenantEntity> {
    const tenant = await this.tenantRepo.findById('system-root', tenantId);
    if (!tenant) throw new NotFoundError('Tenant ' + tenantId + ' not found');
    return tenant;
  }

  public async updateSettings(tenantId: UUID, updates: {
    name?: string;
    currency?: string;
    timezone?: string;
    maxUsers?: number;
    storageLimitMb?: number;
  }): Promise<ITenantEntity> {
    return this.tenantRepo.update('system-root', tenantId, updates);
  }

  public async checkUserLimit(tenantId: UUID, currentUserCount: number): Promise<boolean> {
    const tenant = await this.getTenantById(tenantId);
    return currentUserCount < tenant.maxUsers;
  }
}
