import { UUID, PaginationParams, PaginatedResult } from '../../core/types/common.types';
import { BaseRepository, IBaseEntity } from '../../database/repositories/base.repository';
import { ValidationError } from '../../core/errors/app-error';

export interface ICampaignEntity extends IBaseEntity {
  name: string;
  subject: string;
  bodyHtml: string;
  status: string;
  sentCount: number;
  openCount: number;
  clickCount: number;
  scheduledFor?: string;
}

export class CampaignRepository extends BaseRepository<ICampaignEntity> {
  constructor() { super('Campaign'); }
}

export class CampaignService {
  constructor(private campaignRepo: CampaignRepository) {}

  public async createCampaign(tenantId: UUID, data: {
    name: string;
    subject: string;
    bodyHtml: string;
    scheduledFor?: string;
  }): Promise<ICampaignEntity> {
    if (!data.name || !data.subject) throw new ValidationError('Campaign name and subject required');
    return this.campaignRepo.create(tenantId, {
      ...data,
      status: 'DRAFT',
      sentCount: 0,
      openCount: 0,
      clickCount: 0
    });
  }

  public async listCampaigns(tenantId: UUID, params: PaginationParams): Promise<PaginatedResult<ICampaignEntity>> {
    return this.campaignRepo.list(tenantId, params);
  }
}
