import { DealRepository, IDealEntity } from '../../database/repositories/crm.repositories';
import { UUID, PaginationParams, PaginatedResult } from '../../core/types/common.types';
import { EventBus } from '../../core/events/event-bus';
import { CryptoUtil } from '../../core/security/crypto';
import { ValidationError } from '../../core/errors/app-error';

export class DealService {
  constructor(
    private dealRepo: DealRepository,
    private eventBus: EventBus = EventBus.getInstance()
  ) {}

  public async createDeal(tenantId: UUID, data: {
    accountId?: string;
    pipelineId: string;
    stageId: string;
    ownerUserId?: string;
    title: string;
    amount: number;
    currency?: string;
    probability?: number;
    expectedCloseDate?: string;
  }): Promise<IDealEntity> {
    if (!data.title || data.amount === undefined || !data.pipelineId || !data.stageId) {
      throw new ValidationError('Deal title, amount, pipelineId, and stageId are required');
    }

    const deal = await this.dealRepo.create(tenantId, {
      ...data,
      currency: data.currency || 'USD',
      probability: data.probability !== undefined ? data.probability : 50,
      status: 'OPEN'
    });

    await this.eventBus.publish({
      id: CryptoUtil.generateUuid(),
      name: 'DEAL_CREATED',
      tenantId,
      aggregateId: deal.id,
      aggregateType: 'Deal',
      timestamp: new Date().toISOString(),
      version: 1,
      payload: deal
    });

    return deal;
  }

  public async updateStage(tenantId: UUID, dealId: UUID, newStageId: string, probability?: number): Promise<IDealEntity> {
    const existing = await this.dealRepo.getById(tenantId, dealId);
    const updates: Partial<IDealEntity> = { stageId: newStageId };

    if (probability !== undefined) {
      updates.probability = probability;
    }

    if (newStageId.includes('won')) {
      updates.status = 'WON';
      updates.wonAt = new Date().toISOString();
      updates.probability = 100;
    } else if (newStageId.includes('lost')) {
      updates.status = 'LOST';
      updates.lostAt = new Date().toISOString();
      updates.probability = 0;
    }

    const updated = await this.dealRepo.update(tenantId, dealId, updates);

    await this.eventBus.publish({
      id: CryptoUtil.generateUuid(),
      name: 'DEAL_STAGE_CHANGED',
      tenantId,
      aggregateId: dealId,
      aggregateType: 'Deal',
      timestamp: new Date().toISOString(),
      version: 1,
      payload: { dealId, oldStageId: existing.stageId, newStageId, deal: updated }
    });

    return updated;
  }

  public async listDeals(tenantId: UUID, params: PaginationParams): Promise<PaginatedResult<IDealEntity>> {
    return this.dealRepo.list(tenantId, params);
  }
}
