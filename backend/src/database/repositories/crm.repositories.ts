import { BaseRepository, IBaseEntity } from './base.repository';
import { UUID } from '../../core/types/common.types';

export interface ITenantEntity extends IBaseEntity {
  name: string;
  slug: string;
  status: string;
  tier: string;
  maxUsers: number;
  storageLimitMb: number;
  currency: string;
  timezone: string;
}

export class TenantRepository extends BaseRepository<ITenantEntity> {
  constructor() { super('Tenant'); }
  public async findBySlug(slug: string): Promise<ITenantEntity | null> {
    for (const tenant of this.items.values()) {
      if (tenant.slug === slug) return { ...tenant };
    }
    return null;
  }
}

export interface IUserEntity extends IBaseEntity {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  title?: string;
  department?: string;
  status: string;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  roles: string[];
}

export class UserRepository extends BaseRepository<IUserEntity> {
  constructor() { super('User'); }
  public async findByEmail(tenantId: UUID, email: string): Promise<IUserEntity | null> {
    for (const user of this.items.values()) {
      if (user.tenantId === tenantId && user.email.toLowerCase() === email.toLowerCase()) {
        return { ...user };
      }
    }
    return null;
  }
}

export interface IAccountEntity extends IBaseEntity {
  name: string;
  industry?: string;
  website?: string;
  phone?: string;
  annualRevenue?: number;
  employeeCount?: number;
  rating: string;
  healthScore: number;
  parentAccountId?: string;
  billingCity?: string;
  billingCountry?: string;
}

export class AccountRepository extends BaseRepository<IAccountEntity> {
  constructor() { super('Account'); }
}

export interface IContactEntity extends IBaseEntity {
  accountId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  title?: string;
  isPrimary: boolean;
  linkedinUrl?: string;
  lastContactedAt?: string;
}

export class ContactRepository extends BaseRepository<IContactEntity> {
  constructor() { super('Contact'); }
  public async findByAccountId(tenantId: UUID, accountId: UUID): Promise<IContactEntity[]> {
    return Array.from(this.items.values()).filter(c => c.tenantId === tenantId && c.accountId === accountId);
  }
}

export interface ILeadEntity extends IBaseEntity {
  assignedUserId?: string;
  firstName: string;
  lastName: string;
  company: string;
  title?: string;
  email: string;
  phone?: string;
  source: string;
  status: string;
  score: number;
  estimatedValue?: number;
  convertedAt?: string;
  convertedAccountId?: string;
  convertedContactId?: string;
  convertedDealId?: string;
  notes?: string;
}

export class LeadRepository extends BaseRepository<ILeadEntity> {
  constructor() { super('Lead'); }
}

export interface IDealEntity extends IBaseEntity {
  accountId?: string;
  pipelineId: string;
  stageId: string;
  ownerUserId?: string;
  title: string;
  amount: number;
  currency: string;
  probability: number;
  status: string;
  expectedCloseDate?: string;
  wonAt?: string;
  lostAt?: string;
}

export class DealRepository extends BaseRepository<IDealEntity> {
  constructor() { super('Deal'); }
}

export interface IActivityEntity extends IBaseEntity {
  type: string;
  subject: string;
  description?: string;
  priority: string;
  status: string;
  dueDate?: string;
  startDate?: string;
  endDate?: string;
  completedAt?: string;
  assignedUserId?: string;
  accountId?: string;
  contactId?: string;
  leadId?: string;
  dealId?: string;
}

export class ActivityRepository extends BaseRepository<IActivityEntity> {
  constructor() { super('Activity'); }
}

export interface ITicketEntity extends IBaseEntity {
  ticketNumber: number;
  subject: string;
  description: string;
  priority: string;
  status: string;
  assignedUserId?: string;
  accountId?: string;
  contactId?: string;
  slaDueAt?: string;
  isSlaBreached: boolean;
  firstResponseAt?: string;
  resolvedAt?: string;
}

export class TicketRepository extends BaseRepository<ITicketEntity> {
  private ticketCounter = 1000;
  constructor() { super('Ticket'); }
  public async createTicket(tenantId: UUID, data: Omit<ITicketEntity, 'id' | 'tenantId' | 'createdAt' | 'updatedAt' | 'ticketNumber'>): Promise<ITicketEntity> {
    this.ticketCounter++;
    return this.create(tenantId, {
      ...data,
      ticketNumber: this.ticketCounter
    } as any);
  }
}

export interface IWorkflowEntity extends IBaseEntity {
  name: string;
  description?: string;
  isActive: boolean;
  triggerType: string;
  triggerConfig: any;
  conditions: any[];
  actions: any[];
}

export class WorkflowRepository extends BaseRepository<IWorkflowEntity> {
  constructor() { super('Workflow'); }
}
