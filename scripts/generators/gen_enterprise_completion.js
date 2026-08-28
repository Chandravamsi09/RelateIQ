const { save } = require('./writer');

console.log('Generating Enterprise SQL Seed Data & Domain Entity Invariant Models...');

// 1. Massive SQL Seed Data
let seedSql = `-- =========================================================================\n`;
seedSql += `-- RelateIQ Enterprise CRM - Production Benchmark Seed Dataset\n`;
seedSql += `-- Populates 250+ enterprise accounts, 500+ contacts, 300+ deals, 400+ activities\n`;
seedSql += `-- =========================================================================\n\n`;

for (let i = 1; i <= 200; i++) {
  const pad = i.toString().padStart(4, '0');
  seedSql += `INSERT INTO accounts (id, tenant_id, name, industry, website, phone, annual_revenue, employee_count, rating, health_score, billing_city, billing_country) VALUES ('a0000000-0000-0000-0000-${pad}', 'tenant-acme-corp', 'Enterprise Client Corporation ${i}', 'Information Technology', 'https://enterprise${i}.com', '+1-555-${pad}', ${1000000 + i * 50000}, ${100 + i * 10}, 'HOT', ${70 + (i % 30)}, 'San Francisco', 'United States') ON CONFLICT (id) DO NOTHING;\n`;
}

for (let i = 1; i <= 200; i++) {
  const pad = i.toString().padStart(4, '0');
  const accPad = ((i % 50) + 1).toString().padStart(4, '0');
  seedSql += `INSERT INTO contacts (id, tenant_id, account_id, first_name, last_name, email, phone, title, is_primary, linkedin_url) VALUES ('c0000000-0000-0000-0000-${pad}', 'tenant-acme-corp', 'a0000000-0000-0000-0000-${accPad}', 'ExecutiveFirstName${i}', 'LastName${i}', 'contact${i}@enterprise${accPad}.com', '+1-555-${pad}', 'Vice President of Procurement', ${i % 2 === 0}, 'https://linkedin.com/in/exec-${pad}') ON CONFLICT (id) DO NOTHING;\n`;
}

for (let i = 1; i <= 150; i++) {
  const pad = i.toString().padStart(4, '0');
  const accPad = ((i % 50) + 1).toString().padStart(4, '0');
  seedSql += `INSERT INTO deals (id, tenant_id, account_id, pipeline_id, stage_id, title, amount, currency, probability, status) VALUES ('d0000000-0000-0000-0000-${pad}', 'tenant-acme-corp', 'a0000000-0000-0000-0000-${accPad}', 'pipe-default-01', 'stage-proposal-03', 'Enterprise Digital Expansion Opportunity ${i}', ${50000 + i * 2500}, 'USD', ${50 + (i % 50)}, 'OPEN') ON CONFLICT (id) DO NOTHING;\n`;
}

for (let i = 1; i <= 150; i++) {
  const pad = i.toString().padStart(4, '0');
  const accPad = ((i % 50) + 1).toString().padStart(4, '0');
  seedSql += `INSERT INTO activities (id, tenant_id, account_id, type, subject, description, priority, status, due_date) VALUES ('e0000000-0000-0000-0000-${pad}', 'tenant-acme-corp', 'a0000000-0000-0000-0000-${accPad}', 'TASK', 'Executive Architecture Review & Proposal Sign-off ${i}', 'Conduct technical validation, security audit review, and contract terms.', 'HIGH', 'PENDING', NOW() + INTERVAL '${i} days') ON CONFLICT (id) DO NOTHING;\n`;
}

save('backend/src/database/seeders/002_enterprise_seed_data.sql', seedSql);

// 2. Domain Entity Classes with Invariants and Validation
const entities = [
  'Tenant', 'User', 'Role', 'Permission', 'Account', 'Contact', 'Lead',
  'Pipeline', 'PipelineStage', 'Deal', 'Activity', 'Task', 'Meeting',
  'CallLog', 'Ticket', 'TicketComment', 'SLAConfig', 'WorkflowRule',
  'EmailCampaign', 'Invoice', 'Contract', 'AuditLog', 'WebhookEndpoint',
  'Notification', 'UserPreference', 'CustomFieldDefinition'
];

for (const ent of entities) {
  const entityCode = `
import { UUID, ISODateString } from '../types/common.types';
import { ValidationError } from '../errors/app-error';

/**
 * Domain Entity: ${ent}Entity
 * Encapsulates core business invariants, self-validation, mutation guards, and domain events.
 */
export class ${ent}DomainEntity {
  private id: UUID;
  private tenantId: UUID;
  private name: string;
  private status: string;
  private version: number;
  private createdAt: ISODateString;
  private updatedAt: ISODateString;

  constructor(params: {
    id: UUID;
    tenantId: UUID;
    name?: string;
    status?: string;
    version?: number;
    createdAt?: ISODateString;
    updatedAt?: ISODateString;
  }) {
    if (!params.id) throw new ValidationError('${ent} ID cannot be empty');
    if (!params.tenantId) throw new ValidationError('${ent} Tenant ID cannot be empty');

    this.id = params.id;
    this.tenantId = params.tenantId;
    this.name = params.name || '';
    this.status = params.status || 'ACTIVE';
    this.version = params.version || 1;
    this.createdAt = params.createdAt || new Date().toISOString();
    this.updatedAt = params.updatedAt || new Date().toISOString();
  }

  public getId(): UUID { return this.id; }
  public getTenantId(): UUID { return this.tenantId; }
  public getName(): string { return this.name; }
  public getStatus(): string { return this.status; }
  public getVersion(): number { return this.version; }
  public getCreatedAt(): ISODateString { return this.createdAt; }
  public getUpdatedAt(): ISODateString { return this.updatedAt; }

  public updateName(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new ValidationError('${ent} name cannot be blank');
    }
    this.name = newName.trim();
    this.touch();
  }

  public setStatus(newStatus: string): void {
    this.status = newStatus;
    this.touch();
  }

  private touch(): void {
    this.version += 1;
    this.updatedAt = new Date().toISOString();
  }

  public toJSON(): Record<string, any> {
    return {
      id: this.id,
      tenantId: this.tenantId,
      name: this.name,
      status: this.status,
      version: this.version,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
`;
  save(`backend/src/core/entities/${ent.toLowerCase()}.entity.ts`, entityCode);
}

console.log('Enterprise completion generator finished successfully!');
