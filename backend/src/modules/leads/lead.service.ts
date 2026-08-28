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
