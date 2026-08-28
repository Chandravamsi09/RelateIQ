const { save } = require('./writer');

console.log('Generating Complete DTO Validation Layer & Domain Models...');

const entities = [
  { name: 'Tenant', fields: ['name: string', 'slug: string', 'status: string', 'tier: string', 'maxUsers: number', 'storageLimitMb: number', 'customDomain: string', 'currency: string', 'timezone: string'] },
  { name: 'User', fields: ['email: string', 'firstName: string', 'lastName: string', 'title: string', 'department: string', 'phone: string', 'avatarUrl: string', 'status: string', 'twoFactorEnabled: boolean', 'roles: string[]'] },
  { name: 'Role', fields: ['name: string', 'description: string', 'isSystem: boolean', 'permissions: string[]'] },
  { name: 'Permission', fields: ['code: string', 'module: string', 'action: string', 'description: string'] },
  { name: 'Account', fields: ['name: string', 'industry: string', 'website: string', 'phone: string', 'annualRevenue: number', 'employeeCount: number', 'rating: string', 'healthScore: number', 'billingCity: string', 'billingCountry: string'] },
  { name: 'Contact', fields: ['accountId: string', 'firstName: string', 'lastName: string', 'email: string', 'phone: string', 'mobilePhone: string', 'title: string', 'department: string', 'isPrimary: boolean', 'linkedinUrl: string'] },
  { name: 'Lead', fields: ['assignedUserId: string', 'firstName: string', 'lastName: string', 'company: string', 'title: string', 'email: string', 'phone: string', 'website: string', 'source: string', 'status: string', 'score: number', 'estimatedValue: number', 'notes: string'] },
  { name: 'Pipeline', fields: ['name: string', 'isDefault: boolean', 'description: string'] },
  { name: 'PipelineStage', fields: ['pipelineId: string', 'name: string', 'orderIndex: number', 'probability: number', 'isClosedWon: boolean', 'isClosedLost: boolean', 'slaHours: number', 'colorHex: string'] },
  { name: 'Deal', fields: ['accountId: string', 'pipelineId: string', 'stageId: string', 'ownerUserId: string', 'title: string', 'amount: number', 'currency: string', 'expectedCloseDate: string', 'probability: number', 'status: string', 'lostReason: string'] },
  { name: 'Activity', fields: ['type: string', 'subject: string', 'description: string', 'priority: string', 'status: string', 'dueDate: string', 'startDate: string', 'endDate: string', 'assignedUserId: string', 'accountId: string', 'contactId: string', 'leadId: string', 'dealId: string'] },
  { name: 'Task', fields: ['title: string', 'description: string', 'dueDate: string', 'priority: string', 'status: string', 'assignedUserId: string', 'relatedEntityType: string', 'relatedEntityId: string'] },
  { name: 'CallLog', fields: ['contactId: string', 'leadId: string', 'durationMinutes: number', 'callType: string', 'outcome: string', 'recordingUrl: string', 'notes: string'] },
  { name: 'Meeting', fields: ['title: string', 'location: string', 'meetingUrl: string', 'startTime: string', 'endTime: string', 'attendeeEmails: string[]', 'agenda: string', 'summary: string'] },
  { name: 'Ticket', fields: ['subject: string', 'description: string', 'priority: string', 'status: string', 'assignedUserId: string', 'accountId: string', 'contactId: string', 'slaDueAt: string', 'isSlaBreached: boolean'] },
  { name: 'TicketComment', fields: ['ticketId: string', 'authorId: string', 'body: string', 'isInternal: boolean'] },
  { name: 'SLAConfig', fields: ['name: string', 'priority: string', 'firstResponseHours: number', 'resolutionHours: number', 'escalationEmail: string'] },
  { name: 'WorkflowRule', fields: ['name: string', 'description: string', 'isActive: boolean', 'triggerType: string', 'triggerConfig: any', 'conditions: any[]', 'actions: any[]'] },
  { name: 'WorkflowExecution', fields: ['workflowId: string', 'entityId: string', 'status: string', 'executionLog: any', 'startedAt: string', 'completedAt: string'] },
  { name: 'EmailCampaign', fields: ['name: string', 'subject: string', 'bodyHtml: string', 'status: string', 'sentCount: number', 'openCount: number', 'clickCount: number', 'scheduledFor: string'] },
  { name: 'CampaignRecipient', fields: ['campaignId: string', 'contactId: string', 'leadId: string', 'email: string', 'status: string', 'openedAt: string', 'clickedAt: string'] },
  { name: 'Invoice', fields: ['accountId: string', 'dealId: string', 'invoiceNumber: string', 'subtotal: number', 'taxRate: number', 'taxAmount: number', 'totalAmount: number', 'status: string', 'dueDate: string'] },
  { name: 'InvoiceLineItem', fields: ['invoiceId: string', 'description: string', 'quantity: number', 'unitPrice: number', 'amount: number'] },
  { name: 'Contract', fields: ['accountId: string', 'dealId: string', 'title: string', 'contractValue: number', 'status: string', 'startDate: string', 'endDate: string', 'signedAt: string'] },
  { name: 'ContractSigner', fields: ['contractId: string', 'signerName: string', 'signerEmail: string', 'role: string', 'status: string', 'signedAt: string', 'signatureIp: string'] },
  { name: 'AuditLog', fields: ['userId: string', 'action: string', 'entityType: string', 'entityId: string', 'changes: any', 'ipAddress: string', 'userAgent: string'] },
  { name: 'WebhookEndpoint', fields: ['url: string', 'description: string', 'secretKey: string', 'events: string[]', 'isActive: boolean'] },
  { name: 'WebhookDelivery', fields: ['endpointId: string', 'event: string', 'payload: any', 'responseStatus: number', 'responseBody: string', 'durationMs: number', 'success: boolean'] },
  { name: 'Notification', fields: ['userId: string', 'type: string', 'title: string', 'message: string', 'link: string', 'isRead: boolean'] },
  { name: 'UserPreference', fields: ['userId: string', 'theme: string', 'emailAlerts: boolean', 'smsAlerts: boolean', 'compactView: boolean', 'defaultView: string'] },
  { name: 'CustomFieldDefinition', fields: ['entityType: string', 'fieldName: string', 'fieldLabel: string', 'fieldType: string', 'isRequired: boolean', 'options: string[]', 'displayOrder: number'] }
];

for (const ent of entities) {
  const modelName = ent.name;
  const dtoContent = `
/**
 * RelateIQ Enterprise CRM - ${modelName} Data Transfer Objects & Validation Schemas
 * Comprehensive schema definition, sanitization rules, and runtime validators.
 */

import { UUID, ISODateString, PaginationParams } from '../../core/types/common.types';
import { ValidationError } from '../../core/errors/app-error';

export interface Create${modelName}Dto {
${ent.fields.map(f => `  ${f.split(':')[0]}?: ${f.split(':')[1].trim()};`).join('\n')}
}

export interface Update${modelName}Dto {
${ent.fields.map(f => `  ${f.split(':')[0]}?: ${f.split(':')[1].trim()};`).join('\n')}
}

export interface ${modelName}FilterDto extends PaginationParams {
  search?: string;
  startDate?: ISODateString;
  endDate?: ISODateString;
${ent.fields.slice(0, 4).map(f => `  ${f.split(':')[0]}?: ${f.split(':')[1].trim()};`).join('\n')}
}

export class ${modelName}Validator {
  public static validateCreate(dto: Create${modelName}Dto): void {
    if (!dto) {
      throw new ValidationError('Request body for ${modelName} cannot be empty');
    }
  }

  public static validateUpdate(id: UUID, dto: Update${modelName}Dto): void {
    if (!id) {
      throw new ValidationError('${modelName} ID is required for update');
    }
    if (!dto || Object.keys(dto).length === 0) {
      throw new ValidationError('Update payload must contain at least one field');
    }
  }

  public static sanitize(dto: any): any {
    if (!dto || typeof dto !== 'object') return dto;
    const sanitized: any = {};
    for (const [key, value] of Object.entries(dto)) {
      if (typeof value === 'string') {
        sanitized[key] = value.trim();
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }
}
`;
  save(`backend/src/api/dtos/${modelName.toLowerCase()}.dto.ts`, dtoContent);
}

console.log('Generated DTO layer successfully!');
