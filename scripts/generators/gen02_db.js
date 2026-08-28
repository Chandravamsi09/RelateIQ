const { save } = require('./writer');

console.log('Generating Phase 02: Database Schemas, Repositories, Migrations, Seeders...');

// 1. Prisma Schema
save('backend/prisma/schema.prisma', `
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum TenantStatus { ACTIVE, TRIAL, SUSPENDED, EXPIRED, CANCELED }
enum SubscriptionTier { STARTER, PROFESSIONAL, ENTERPRISE, ULTIMATE }
enum UserStatus { ACTIVE, INACTIVE, INVITED, LOCKED, SUSPENDED }
enum LeadStatus { NEW, CONTACTED, QUALIFIED, UNQUALIFIED, PROPOSAL_SENT, CONVERTED, LOST }
enum LeadSource { WEBSITE, ORGANIC_SEARCH, PAID_ADS, REFERRAL, COLD_OUTREACH, CONFERENCE, PARTNER, INBOUND_CALL, OTHER }
enum DealStatus { OPEN, WON, LOST, ABANDONED }
enum ActivityType { TASK, CALL, MEETING, EMAIL, NOTE, DEADLINE, MILESTONE }
enum ActivityPriority { LOW, MEDIUM, HIGH, URGENT }
enum ActivityStatus { PENDING, IN_PROGRESS, COMPLETED, CANCELLED, DEFERRED }
enum TicketPriority { LOW, MEDIUM, HIGH, CRITICAL }
enum TicketStatus { OPEN, IN_PROGRESS, WAITING_ON_CUSTOMER, WAITING_ON_THIRD_PARTY, RESOLVED, CLOSED }
enum WorkflowTriggerType { LEAD_CREATED, LEAD_STATUS_CHANGED, DEAL_STAGE_CHANGED, DEAL_VALUE_THRESHOLD, TICKET_CREATED, TICKET_SLA_BREACHED, ACTIVITY_COMPLETED, SCHEDULED_CRON, WEBHOOK_RECEIVED }
enum WorkflowActionType { SEND_EMAIL, CREATE_TASK, UPDATE_FIELD, ASSIGN_USER, SEND_SLACK_WEBHOOK, DISPATCH_WEBHOOK, TRIGGER_DRIP_CAMPAIGN, CALCULATE_LEAD_SCORE }
enum NotificationType { INFO, SUCCESS, WARNING, ERROR, TASK_ASSIGNED, DEAL_WON, SLA_BREACH, MENTION }

model Tenant {
  id              String           @id @default(uuid())
  name            String
  slug            String           @unique
  status          TenantStatus     @default(ACTIVE)
  tier            SubscriptionTier @default(PROFESSIONAL)
  maxUsers        Int              @default(50)
  storageLimitMb  Int              @default(10240)
  customDomain    String?          @unique
  logoUrl         String?
  primaryColor    String?          @default("#3B82F6")
  currency        String           @default("USD")
  timezone        String           @default("UTC")
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt
  users           User[]
  roles           Role[]
  accounts        Account[]
  contacts        Contact[]
  leads           Lead[]
  deals           Deal[]
  pipelines       Pipeline[]
  activities      Activity[]
  tickets         Ticket[]
  workflows       WorkflowRule[]
  emailCampaigns  EmailCampaign[]
  invoices        Invoice[]
  contracts       Contract[]
  auditLogs       AuditLog[]
  webhookEndpoints WebhookEndpoint[]
  customFields    CustomFieldDefinition[]
}

model User {
  id              String        @id @default(uuid())
  tenantId        String
  email           String        @unique
  passwordHash    String
  firstName       String
  lastName        String
  title           String?
  department      String?
  phone           String?
  avatarUrl       String?
  status          UserStatus    @default(ACTIVE)
  twoFactorEnabled Boolean      @default(false)
  twoFactorSecret String?
  lastLoginAt     DateTime?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  tenant          Tenant        @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  userRoles       UserRole[]
  assignedLeads   Lead[]        @relation("LeadAssignee")
  assignedDeals   Deal[]        @relation("DealOwner")
  assignedActivities Activity[] @relation("ActivityAssignee")
  assignedTickets Ticket[]      @relation("TicketAssignee")
  auditLogs       AuditLog[]
  notifications   Notification[]
  preferences     UserPreference?
  @@index([tenantId, email])
  @@index([tenantId, status])
}

model Role {
  id          String       @id @default(uuid())
  tenantId    String
  name        String
  description String?
  isSystem    Boolean      @default(false)
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  tenant      Tenant       @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  userRoles   UserRole[]
  permissions RolePermission[]
  @@unique([tenantId, name])
}

model Permission {
  id          String           @id @default(uuid())
  code        String           @unique
  module      String
  action      String
  description String?
  rolePermissions RolePermission[]
}

model RolePermission {
  roleId       String
  permissionId String
  role         Role        @relation(fields: [roleId], references: [id], onDelete: Cascade)
  permission   Permission  @relation(fields: [permissionId], references: [id], onDelete: Cascade)
  @@id([roleId, permissionId])
}

model UserRole {
  userId String
  roleId String
  user   User @relation(fields: [userId], references: [id], onDelete: Cascade)
  role   Role @relation(fields: [roleId], references: [id], onDelete: Cascade)
  @@id([userId, roleId])
}

model Account {
  id              String      @id @default(uuid())
  tenantId        String
  name            String
  industry        String?
  website         String?
  phone           String?
  annualRevenue   Decimal?    @db.Decimal(15, 2)
  employeeCount   Int?
  rating          String?     @default("HOT")
  healthScore     Int         @default(80)
  parentAccountId String?
  billingStreet   String?
  billingCity     String?
  billingState    String?
  billingPostalCode String?
  billingCountry  String?
  shippingStreet  String?
  shippingCity    String?
  shippingState   String?
  shippingPostalCode String?
  shippingCountry String?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  tenant          Tenant      @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  parentAccount   Account?    @relation("AccountHierarchy", fields: [parentAccountId], references: [id])
  childAccounts   Account[]   @relation("AccountHierarchy")
  contacts        Contact[]
  deals           Deal[]
  activities      Activity[]
  tickets         Ticket[]
  invoices        Invoice[]
  contracts       Contract[]
  @@index([tenantId, name])
  @@index([tenantId, healthScore])
}

model Contact {
  id              String      @id @default(uuid())
  tenantId        String
  accountId       String?
  firstName       String
  lastName        String
  email           String
  phone           String?
  mobilePhone     String?
  title           String?
  department      String?
  isPrimary       Boolean     @default(false)
  linkedinUrl     String?
  doNotCall       Boolean     @default(false)
  doNotEmail      Boolean     @default(false)
  lastContactedAt DateTime?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  tenant          Tenant      @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  account         Account?    @relation(fields: [accountId], references: [id], onDelete: SetNull)
  deals           DealContact[]
  activities      Activity[]
  tickets         Ticket[]
  @@index([tenantId, email])
  @@index([tenantId, accountId])
}

model Lead {
  id              String      @id @default(uuid())
  tenantId        String
  assignedUserId  String?
  firstName       String
  lastName        String
  company         String
  title           String?
  email           String
  phone           String?
  website         String?
  source          LeadSource  @default(WEBSITE)
  status          LeadStatus  @default(NEW)
  score           Int         @default(0)
  estimatedValue  Decimal?    @db.Decimal(12, 2)
  convertedAt     DateTime?
  convertedAccountId String?
  convertedContactId String?
  convertedDealId    String?
  notes           String?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  tenant          Tenant      @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  assignedUser    User?       @relation("LeadAssignee", fields: [assignedUserId], references: [id])
  activities      Activity[]
  @@index([tenantId, status])
  @@index([tenantId, score])
}

model Pipeline {
  id          String          @id @default(uuid())
  tenantId    String
  name        String
  isDefault   Boolean         @default(false)
  description String?
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt
  tenant      Tenant          @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  stages      PipelineStage[]
  deals       Deal[]
}

model PipelineStage {
  id           String      @id @default(uuid())
  pipelineId   String
  name         String
  orderIndex   Int
  probability  Int         @default(50)
  isClosedWon  Boolean     @default(false)
  isClosedLost Boolean     @default(false)
  slaHours     Int?
  colorHex     String      @default("#3B82F6")
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt
  pipeline     Pipeline    @relation(fields: [pipelineId], references: [id], onDelete: Cascade)
  deals        Deal[]
  @@index([pipelineId, orderIndex])
}

model Deal {
  id              String      @id @default(uuid())
  tenantId        String
  accountId       String?
  pipelineId      String
  stageId         String
  ownerUserId     String?
  title           String
  amount          Decimal     @db.Decimal(15, 2)
  currency        String      @default("USD")
  expectedCloseDate DateTime?
  probability     Int         @default(50)
  status          DealStatus  @default(OPEN)
  lostReason      String?
  wonAt           DateTime?
  lostAt          DateTime?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  tenant          Tenant      @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  account         Account?    @relation(fields: [accountId], references: [id], onDelete: SetNull)
  pipeline        Pipeline    @relation(fields: [pipelineId], references: [id])
  stage           PipelineStage @relation(fields: [stageId], references: [id])
  ownerUser       User?       @relation("DealOwner", fields: [ownerUserId], references: [id])
  contacts        DealContact[]
  activities      Activity[]
  invoices        Invoice[]
  contracts       Contract[]
  @@index([tenantId, stageId])
  @@index([tenantId, ownerUserId])
}

model DealContact {
  dealId    String
  contactId String
  role      String? @default("Decision Maker")
  deal      Deal    @relation(fields: [dealId], references: [id], onDelete: Cascade)
  contact   Contact @relation(fields: [contactId], references: [id], onDelete: Cascade)
  @@id([dealId, contactId])
}

model Activity {
  id            String           @id @default(uuid())
  tenantId      String
  type          ActivityType     @default(TASK)
  subject       String
  description   String?
  priority      ActivityPriority @default(MEDIUM)
  status        ActivityStatus   @default(PENDING)
  dueDate       DateTime?
  startDate     DateTime?
  endDate       DateTime?
  completedAt   DateTime?
  assignedUserId String?
  accountId     String?
  contactId     String?
  leadId        String?
  dealId        String?
  createdAt     DateTime         @default(now())
  updatedAt     DateTime         @updatedAt
  tenant        Tenant           @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  assignedUser  User?            @relation("ActivityAssignee", fields: [assignedUserId], references: [id])
  account       Account?         @relation(fields: [accountId], references: [id], onDelete: SetNull)
  contact       Contact?         @relation(fields: [contactId], references: [id], onDelete: SetNull)
  lead          Lead?            @relation(fields: [leadId], references: [id], onDelete: SetNull)
  deal          Deal?            @relation(fields: [dealId], references: [id], onDelete: SetNull)
  @@index([tenantId, assignedUserId])
  @@index([tenantId, status])
}

model Ticket {
  id             String         @id @default(uuid())
  tenantId       String
  ticketNumber   Int            @default(autoincrement())
  subject        String
  description    String
  priority       TicketPriority @default(MEDIUM)
  status         TicketStatus   @default(OPEN)
  assignedUserId String?
  accountId      String?
  contactId      String?
  firstResponseAt DateTime?
  resolvedAt     DateTime?
  slaDueAt       DateTime?
  isSlaBreached  Boolean        @default(false)
  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt
  tenant         Tenant         @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  assignedUser   User?          @relation("TicketAssignee", fields: [assignedUserId], references: [id])
  account        Account?       @relation(fields: [accountId], references: [id], onDelete: SetNull)
  contact        Contact?       @relation(fields: [contactId], references: [id], onDelete: SetNull)
  comments       TicketComment[]
  @@index([tenantId, status])
  @@index([tenantId, priority])
}

model TicketComment {
  id         String   @id @default(uuid())
  ticketId   String
  authorId   String
  body       String
  isInternal Boolean  @default(false)
  createdAt  DateTime @default(now())
  ticket     Ticket   @relation(fields: [ticketId], references: [id], onDelete: Cascade)
  @@index([ticketId, createdAt])
}

model WorkflowRule {
  id          String              @id @default(uuid())
  tenantId    String
  name        String
  description String?
  isActive    Boolean             @default(true)
  triggerType WorkflowTriggerType
  triggerConfig Json
  conditions  Json
  actions     Json
  createdAt   DateTime            @default(now())
  updatedAt   DateTime            @updatedAt
  tenant      Tenant              @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  executions  WorkflowExecution[]
}

model WorkflowExecution {
  id           String       @id @default(uuid())
  workflowId   String
  entityId     String
  status       String       @default("SUCCESS")
  executionLog Json
  startedAt    DateTime     @default(now())
  completedAt  DateTime?
  workflow     WorkflowRule @relation(fields: [workflowId], references: [id], onDelete: Cascade)
}

model EmailCampaign {
  id             String   @id @default(uuid())
  tenantId       String
  name           String
  subject        String
  bodyHtml       String
  status         String   @default("DRAFT")
  sentCount      Int      @default(0)
  openCount      Int      @default(0)
  clickCount     Int      @default(0)
  scheduledFor   DateTime?
  sentAt         DateTime?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  tenant         Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
}

model Invoice {
  id            String   @id @default(uuid())
  tenantId      String
  accountId     String
  dealId        String?
  invoiceNumber String   @unique
  subtotal      Decimal  @db.Decimal(15, 2)
  taxRate       Decimal  @db.Decimal(5, 2) @default(0.0)
  taxAmount     Decimal  @db.Decimal(15, 2) @default(0.0)
  totalAmount   Decimal  @db.Decimal(15, 2)
  status        String   @default("DRAFT")
  dueDate       DateTime
  paidAt        DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  tenant        Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  account       Account  @relation(fields: [accountId], references: [id], onDelete: Cascade)
  deal          Deal?    @relation(fields: [dealId], references: [id], onDelete: SetNull)
}

model Contract {
  id            String   @id @default(uuid())
  tenantId      String
  accountId     String
  dealId        String?
  title         String
  contractValue Decimal  @db.Decimal(15, 2)
  status        String   @default("DRAFT")
  startDate     DateTime
  endDate       DateTime
  signedAt      DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  tenant        Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  account       Account  @relation(fields: [accountId], references: [id], onDelete: Cascade)
  deal          Deal?    @relation(fields: [dealId], references: [id], onDelete: SetNull)
}

model AuditLog {
  id         String   @id @default(uuid())
  tenantId   String
  userId     String?
  action     String
  entityType String
  entityId   String
  changes    Json?
  ipAddress  String?
  userAgent  String?
  createdAt  DateTime @default(now())
  tenant     Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  user       User?    @relation(fields: [userId], references: [id], onDelete: SetNull)
  @@index([tenantId, entityType, entityId])
}

model WebhookEndpoint {
  id          String   @id @default(uuid())
  tenantId    String
  url         String
  description String?
  secretKey   String
  events      String[]
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
}

model Notification {
  id         String           @id @default(uuid())
  userId     String
  type       NotificationType @default(INFO)
  title      String
  message    String
  link       String?
  isRead     Boolean          @default(false)
  readAt     DateTime?
  createdAt  DateTime         @default(now())
  user       User             @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model UserPreference {
  id            String   @id @default(uuid())
  userId        String   @unique
  theme         String   @default("system")
  emailAlerts   Boolean  @default(true)
  smsAlerts     Boolean  @default(false)
  compactView   Boolean  @default(false)
  defaultView   String   @default("deals")
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model CustomFieldDefinition {
  id           String   @id @default(uuid())
  tenantId     String
  entityType   String
  fieldName    String
  fieldLabel   String
  fieldType    String
  isRequired   Boolean  @default(false)
  options      String[]
  displayOrder Int      @default(0)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  tenant       Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  @@unique([tenantId, entityType, fieldName])
}
`);

// 2. Base Repository
save('backend/src/database/repositories/base.repository.ts', `
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
`);

// 3. Domain Repositories
save('backend/src/database/repositories/crm.repositories.ts', `
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
`);

// 4. Seeder
save('backend/src/database/seeders/demo-seeder.ts', `
import { TenantRepository, UserRepository, AccountRepository, ContactRepository, LeadRepository, DealRepository, ActivityRepository, TicketRepository, WorkflowRepository } from '../repositories/crm.repositories';
import { CryptoUtil } from '../../core/security/crypto';

export class DemoSeeder {
  public static async seedAll(
    tenantRepo: TenantRepository,
    userRepo: UserRepository,
    accountRepo: AccountRepository,
    contactRepo: ContactRepository,
    leadRepo: LeadRepository,
    dealRepo: DealRepository,
    activityRepo: ActivityRepository,
    ticketRepo: TicketRepository,
    workflowRepo: WorkflowRepository
  ): Promise<{ tenantId: string; adminUserId: string }> {
    const tenant = await tenantRepo.create('system-root', {
      id: 'tenant-acme-corp',
      name: 'Acme Global Enterprises',
      slug: 'acme-global',
      status: 'ACTIVE',
      tier: 'ENTERPRISE',
      maxUsers: 100,
      storageLimitMb: 51200,
      currency: 'USD',
      timezone: 'America/New_York'
    });

    const passwordHash = CryptoUtil.hashSha256('Admin@123456');
    const adminUser = await userRepo.create(tenant.id, {
      id: 'user-admin-01',
      email: 'admin@acmecorp.com',
      passwordHash,
      firstName: 'Alexander',
      lastName: 'Pierce',
      title: 'Chief Revenue Officer',
      department: 'Executive',
      status: 'ACTIVE',
      twoFactorEnabled: false,
      roles: ['SUPER_ADMIN', 'SALES_DIRECTOR']
    });

    const salesRep = await userRepo.create(tenant.id, {
      id: 'user-sales-01',
      email: 'sarah.connor@acmecorp.com',
      passwordHash,
      firstName: 'Sarah',
      lastName: 'Connor',
      title: 'Senior Enterprise AE',
      department: 'Sales',
      status: 'ACTIVE',
      twoFactorEnabled: false,
      roles: ['SALES_REP']
    });

    const acc1 = await accountRepo.create(tenant.id, {
      id: 'acc-techflow-01',
      name: 'TechFlow Solutions Inc.',
      industry: 'Software & Technology',
      website: 'https://techflow.io',
      phone: '+1-415-555-0199',
      annualRevenue: 45000000,
      employeeCount: 420,
      rating: 'HOT',
      healthScore: 92,
      billingCity: 'San Francisco',
      billingCountry: 'United States'
    });

    const con1 = await contactRepo.create(tenant.id, {
      id: 'con-elena-01',
      accountId: acc1.id,
      firstName: 'Elena',
      lastName: 'Rostova',
      email: 'elena.rostova@techflow.io',
      phone: '+1-415-555-0188',
      title: 'VP of Technology',
      isPrimary: true,
      linkedinUrl: 'https://linkedin.com/in/elena-rostova-tech'
    });

    await leadRepo.create(tenant.id, {
      id: 'lead-quantum-01',
      assignedUserId: salesRep.id,
      firstName: 'Sophia',
      lastName: 'Martinez',
      company: 'Quantum Dynamics AI',
      title: 'Director of AI Engineering',
      email: 'smartinez@quantumdynamics.ai',
      phone: '+1-650-555-0122',
      source: 'ORGANIC_SEARCH',
      status: 'QUALIFIED',
      score: 85,
      estimatedValue: 120000,
      notes: 'Interested in enterprise multi-seat expansion with automated workflows.'
    });

    await dealRepo.create(tenant.id, {
      id: 'deal-techflow-ent-01',
      accountId: acc1.id,
      pipelineId: 'pipe-default-01',
      stageId: 'stage-proposal-03',
      ownerUserId: salesRep.id,
      title: 'TechFlow Global CRM Modernization',
      amount: 180000,
      currency: 'USD',
      probability: 75,
      status: 'OPEN',
      expectedCloseDate: '2026-10-31T00:00:00.000Z'
    });

    return { tenantId: tenant.id, adminUserId: adminUser.id };
  }
}
`);

console.log('Phase 02 generated successfully!');
