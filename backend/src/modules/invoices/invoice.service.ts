import { UUID, PaginationParams, PaginatedResult } from '../../core/types/common.types';
import { BaseRepository, IBaseEntity } from '../../database/repositories/base.repository';
import { ValidationError } from '../../core/errors/app-error';
import { MathUtils } from '../../core/utils/math-utils';

export interface IInvoiceEntity extends IBaseEntity {
  accountId: string;
  dealId?: string;
  invoiceNumber: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  status: string;
  dueDate: string;
  paidAt?: string;
}

export class InvoiceRepository extends BaseRepository<IInvoiceEntity> {
  constructor() { super('Invoice'); }
}

export class InvoiceService {
  private counter = 5000;
  constructor(private invoiceRepo: InvoiceRepository) {}

  public async createInvoice(tenantId: UUID, data: {
    accountId: string;
    dealId?: string;
    subtotal: number;
    taxRate?: number;
    dueDate: string;
  }): Promise<IInvoiceEntity> {
    this.counter++;
    const taxRate = data.taxRate || 0.08;
    const taxAmount = MathUtils.round(data.subtotal * taxRate, 2);
    const totalAmount = MathUtils.round(data.subtotal + taxAmount, 2);

    return this.invoiceRepo.create(tenantId, {
      accountId: data.accountId,
      dealId: data.dealId,
      invoiceNumber: 'INV-' + this.counter,
      subtotal: data.subtotal,
      taxRate,
      taxAmount,
      totalAmount,
      status: 'DRAFT',
      dueDate: data.dueDate
    });
  }

  public async markAsPaid(tenantId: UUID, invoiceId: UUID): Promise<IInvoiceEntity> {
    return this.invoiceRepo.update(tenantId, invoiceId, {
      status: 'PAID',
      paidAt: new Date().toISOString()
    });
  }
}
