const { save } = require('./writer');

console.log('Generating Phase 04: Customer 360, Accounts, Contacts & Relationship Services...');

// 1. Account Service
save('backend/src/modules/accounts/account.service.ts', `
import { AccountRepository, ContactRepository, IAccountEntity } from '../../database/repositories/crm.repositories';
import { UUID, PaginationParams, PaginatedResult } from '../../core/types/common.types';
import { EventBus } from '../../core/events/event-bus';
import { CryptoUtil } from '../../core/security/crypto';
import { ValidationError, NotFoundError } from '../../core/errors/app-error';

export class AccountService {
  constructor(
    private accountRepo: AccountRepository,
    private contactRepo: ContactRepository,
    private eventBus: EventBus = EventBus.getInstance()
  ) {}

  public async createAccount(tenantId: UUID, data: {
    name: string;
    industry?: string;
    website?: string;
    phone?: string;
    annualRevenue?: number;
    employeeCount?: number;
    rating?: string;
    parentAccountId?: string;
    billingCity?: string;
    billingCountry?: string;
  }): Promise<IAccountEntity> {
    if (!data.name || data.name.trim().length === 0) {
      throw new ValidationError('Account name is required');
    }

    const healthScore = this.calculateInitialHealthScore(data);
    const account = await this.accountRepo.create(tenantId, {
      ...data,
      rating: data.rating || 'WARM',
      healthScore
    });

    await this.eventBus.publish({
      id: CryptoUtil.generateUuid(),
      name: 'ACCOUNT_CREATED',
      tenantId,
      aggregateId: account.id,
      aggregateType: 'Account',
      timestamp: new Date().toISOString(),
      version: 1,
      payload: account
    });

    return account;
  }

  public async calculateHealthScore(tenantId: UUID, accountId: UUID): Promise<number> {
    const account = await this.accountRepo.getById(tenantId, accountId);
    const contacts = await this.contactRepo.findByAccountId(tenantId, accountId);
    
    let score = 50;
    if (contacts.length > 0) score += 15;
    if (contacts.some(c => c.isPrimary)) score += 10;
    if (account.annualRevenue && account.annualRevenue > 1000000) score += 15;
    if (account.website) score += 5;
    if (account.phone) score += 5;

    score = Math.min(100, Math.max(0, score));
    await this.accountRepo.update(tenantId, accountId, { healthScore: score });
    return score;
  }

  private calculateInitialHealthScore(data: any): number {
    let score = 60;
    if (data.website) score += 10;
    if (data.annualRevenue && data.annualRevenue > 500000) score += 15;
    if (data.employeeCount && data.employeeCount > 50) score += 15;
    return Math.min(100, score);
  }

  public async getAccount360(tenantId: UUID, accountId: UUID) {
    const account = await this.accountRepo.getById(tenantId, accountId);
    const contacts = await this.contactRepo.findByAccountId(tenantId, accountId);
    return {
      account,
      contacts,
      totalContacts: contacts.length,
      primaryContact: contacts.find(c => c.isPrimary) || null
    };
  }

  public async listAccounts(tenantId: UUID, params: PaginationParams): Promise<PaginatedResult<IAccountEntity>> {
    return this.accountRepo.list(tenantId, params);
  }
}
`);

// 2. Contact Service
save('backend/src/modules/contacts/contact.service.ts', `
import { ContactRepository, AccountRepository, IContactEntity } from '../../database/repositories/crm.repositories';
import { UUID, PaginationParams, PaginatedResult } from '../../core/types/common.types';
import { EventBus } from '../../core/events/event-bus';
import { CryptoUtil } from '../../core/security/crypto';
import { ValidationError } from '../../core/errors/app-error';

export class ContactService {
  constructor(
    private contactRepo: ContactRepository,
    private accountRepo: AccountRepository,
    private eventBus: EventBus = EventBus.getInstance()
  ) {}

  public async createContact(tenantId: UUID, data: {
    accountId?: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    title?: string;
    isPrimary?: boolean;
    linkedinUrl?: string;
  }): Promise<IContactEntity> {
    if (!data.email || !data.firstName || !data.lastName) {
      throw new ValidationError('First name, last name, and valid email are required');
    }

    if (data.accountId) {
      await this.accountRepo.getById(tenantId, data.accountId);
    }

    const contact = await this.contactRepo.create(tenantId, {
      ...data,
      isPrimary: data.isPrimary || false
    });

    await this.eventBus.publish({
      id: CryptoUtil.generateUuid(),
      name: 'CONTACT_CREATED',
      tenantId,
      aggregateId: contact.id,
      aggregateType: 'Contact',
      timestamp: new Date().toISOString(),
      version: 1,
      payload: contact
    });

    return contact;
  }

  public async listContacts(tenantId: UUID, params: PaginationParams): Promise<PaginatedResult<IContactEntity>> {
    return this.contactRepo.list(tenantId, params);
  }
}
`);

console.log('Phase 04 generated successfully!');
