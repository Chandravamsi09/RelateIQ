const { save } = require('./writer');

console.log('Generating Phase 05: Leads, AI Lead Scoring, Pipelines, Deals & Conversions...');

// 1. Lead Scoring Engine
save('backend/src/modules/leads/lead-scoring.service.ts', `
import { ILeadEntity } from '../../database/repositories/crm.repositories';

export interface ScoringRule {
  field: keyof ILeadEntity;
  condition: 'equals' | 'contains' | 'greaterThan' | 'exists';
  targetValue: any;
  points: number;
}

export class LeadScoringService {
  private defaultRules: ScoringRule[] = [
    { field: 'company', condition: 'exists', targetValue: true, points: 15 },
    { field: 'phone', condition: 'exists', targetValue: true, points: 15 },
    { field: 'source', condition: 'equals', targetValue: 'REFERRAL', points: 30 },
    { field: 'source', condition: 'equals', targetValue: 'ORGANIC_SEARCH', points: 20 },
    { field: 'source', condition: 'equals', targetValue: 'CONFERENCE', points: 25 },
    { field: 'title', condition: 'contains', targetValue: 'VP', points: 20 },
    { field: 'title', condition: 'contains', targetValue: 'Director', points: 15 },
    { field: 'title', condition: 'contains', targetValue: 'Chief', points: 25 },
    { field: 'title', condition: 'contains', targetValue: 'CTO', points: 25 },
    { field: 'title', condition: 'contains', targetValue: 'CEO', points: 25 },
    { field: 'estimatedValue', condition: 'greaterThan', targetValue: 50000, points: 25 }
  ];

  public calculateScore(lead: Partial<ILeadEntity>): number {
    let score = 0;
    for (const rule of this.defaultRules) {
      const val = (lead as any)[rule.field];
      if (rule.condition === 'exists') {
        if (val !== undefined && val !== null && val !== '') score += rule.points;
      } else if (rule.condition === 'equals') {
        if (val === rule.targetValue) score += rule.points;
      } else if (rule.condition === 'contains') {
        if (typeof val === 'string' && val.toLowerCase().includes(String(rule.targetValue).toLowerCase())) {
          score += rule.points;
        }
      } else if (rule.condition === 'greaterThan') {
        if (typeof val === 'number' && val > Number(rule.targetValue)) {
          score += rule.points;
        }
      }
    }
    return Math.min(100, score);
  }
}
`);

// 2. Lead Service with Conversion
save('backend/src/modules/leads/lead.service.ts', `
import { LeadRepository, AccountRepository, ContactRepository, DealRepository, ILeadEntity } from '../../database/repositories/crm.repositories';
import { UUID, PaginationParams, PaginatedResult } from '../../core/types/common.types';
import { LeadScoringService } from './lead-scoring.service';
import { EventBus } from '../../core/events/event-bus';
import { CryptoUtil } from '../../core/security/crypto';
import { ValidationError, BusinessRuleViolationError } from '../../core/errors/app-error';

export class LeadService {
  private scoringService = new LeadScoringService();

  constructor(
    private leadRepo: LeadRepository,
    private accountRepo: AccountRepository,
    private contactRepo: ContactRepository,
    private dealRepo: DealRepository,
    private eventBus: EventBus = EventBus.getInstance()
  ) {}

  public async createLead(tenantId: UUID, data: {
    firstName: string;
    lastName: string;
    company: string;
    email: string;
    title?: string;
    phone?: string;
    source?: string;
    estimatedValue?: number;
    notes?: string;
    assignedUserId?: string;
  }): Promise<ILeadEntity> {
    if (!data.firstName || !data.lastName || !data.company || !data.email) {
      throw new ValidationError('First name, last name, company, and email are required');
    }

    const calculatedScore = this.scoringService.calculateScore(data as any);

    const lead = await this.leadRepo.create(tenantId, {
      ...data,
      source: data.source || 'WEBSITE',
      status: 'NEW',
      score: calculatedScore
    });

    await this.eventBus.publish({
      id: CryptoUtil.generateUuid(),
      name: 'LEAD_CREATED',
      tenantId,
      aggregateId: lead.id,
      aggregateType: 'Lead',
      timestamp: new Date().toISOString(),
      version: 1,
      payload: lead
    });

    return lead;
  }

  public async convertLead(tenantId: UUID, leadId: UUID, conversionParams: {
    dealTitle?: string;
    pipelineId?: string;
    stageId?: string;
    dealAmount?: number;
    ownerUserId?: string;
  }) {
    const lead = await this.leadRepo.getById(tenantId, leadId);
    if (lead.status === 'CONVERTED') {
      throw new BusinessRuleViolationError('Lead has already been converted');
    }

    // 1. Create Account
    const account = await this.accountRepo.create(tenantId, {
      name: lead.company,
      phone: lead.phone,
      rating: lead.score >= 70 ? 'HOT' : 'WARM',
      healthScore: Math.min(100, lead.score + 10)
    });

    // 2. Create Contact
    const contact = await this.contactRepo.create(tenantId, {
      accountId: account.id,
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phone: lead.phone,
      title: lead.title,
      isPrimary: true
    });

    // 3. Create Opportunity / Deal
    const deal = await this.dealRepo.create(tenantId, {
      accountId: account.id,
      pipelineId: conversionParams.pipelineId || 'pipe-default-01',
      stageId: conversionParams.stageId || 'stage-qualified-01',
      ownerUserId: conversionParams.ownerUserId || lead.assignedUserId,
      title: conversionParams.dealTitle || (lead.company + ' - Initial Opportunity'),
      amount: conversionParams.dealAmount || lead.estimatedValue || 10000,
      currency: 'USD',
      probability: 50,
      status: 'OPEN'
    });

    // 4. Update Lead record as Converted
    const updatedLead = await this.leadRepo.update(tenantId, leadId, {
      status: 'CONVERTED',
      convertedAt: new Date().toISOString(),
      convertedAccountId: account.id,
      convertedContactId: contact.id,
      convertedDealId: deal.id
    });

    await this.eventBus.publish({
      id: CryptoUtil.generateUuid(),
      name: 'LEAD_CONVERTED',
      tenantId,
      aggregateId: lead.id,
      aggregateType: 'Lead',
      timestamp: new Date().toISOString(),
      version: 1,
      payload: { lead: updatedLead, account, contact, deal }
    });

    return {
      lead: updatedLead,
      account,
      contact,
      deal
    };
  }

  public async listLeads(tenantId: UUID, params: PaginationParams): Promise<PaginatedResult<ILeadEntity>> {
    return this.leadRepo.list(tenantId, params);
  }
}
`);

// 3. Deal & Pipeline Service
save('backend/src/modules/deals/deal.service.ts', `
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
`);

console.log('Phase 05 generated successfully!');
