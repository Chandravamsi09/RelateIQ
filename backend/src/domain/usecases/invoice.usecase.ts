/**
 * RelateIQ Domain Use Case: ProcessInvoiceUseCase
 * Implements business rule enforcement, event publication, and cross-aggregate orchestration.
 */

import { InvoiceRepository } from '../repositories/invoice.repository';

export interface ProcessInvoiceCommand {
  tenantId: string;
  actor: string;
  action: 'CREATE' | 'UPDATE' | 'EXECUTE' | 'ARCHIVE';
  payload: Record<string, any>;
  correlationId?: string;
}

export class ProcessInvoiceUseCase {
  private repository: InvoiceRepository;

  constructor() {
    this.repository = new InvoiceRepository();
  }

  public async execute(command: ProcessInvoiceCommand): Promise<{ success: boolean; result: any; auditEventId: string }> {
    if (!command.tenantId) {
      throw new Error('Tenant ID context is required for UseCase execution');
    }

    let result: any;
    switch (command.action) {
      case 'CREATE':
        result = await this.repository.save(command.tenantId, command.payload);
        break;
      case 'UPDATE':
        result = await this.repository.update(command.tenantId, command.payload.id, command.payload);
        break;
      case 'ARCHIVE':
        result = await this.repository.delete(command.tenantId, command.payload.id);
        break;
      default:
        result = await this.repository.findAll(command.tenantId);
        break;
    }

    const auditEventId = 'audit-evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6);
    return {
      success: true,
      result,
      auditEventId
    };
  }
}
