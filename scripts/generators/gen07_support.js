const { save } = require('./writer');

console.log('Generating Phase 07: Help Desk, SLA Breach Tracking & Escalation Engine...');

save('backend/src/modules/support/ticket.service.ts', `
import { TicketRepository, ITicketEntity } from '../../database/repositories/crm.repositories';
import { UUID, PaginationParams, PaginatedResult } from '../../core/types/common.types';
import { EventBus } from '../../core/events/event-bus';
import { CryptoUtil } from '../../core/security/crypto';
import { DateUtils } from '../../core/utils/date-utils';
import { ValidationError } from '../../core/errors/app-error';

export class TicketService {
  constructor(
    private ticketRepo: TicketRepository,
    private eventBus: EventBus = EventBus.getInstance()
  ) {}

  public async createTicket(tenantId: UUID, data: {
    subject: string;
    description: string;
    priority?: string;
    assignedUserId?: string;
    accountId?: string;
    contactId?: string;
  }): Promise<ITicketEntity> {
    if (!data.subject || !data.description) {
      throw new ValidationError('Ticket subject and description are required');
    }

    const priority = data.priority || 'MEDIUM';
    const slaHours = priority === 'CRITICAL' ? 4 : priority === 'HIGH' ? 8 : 24;
    const slaDueAt = DateUtils.addHours(new Date(), slaHours).toISOString();

    const ticket = await this.ticketRepo.createTicket(tenantId, {
      subject: data.subject,
      description: data.description,
      priority,
      status: 'OPEN',
      assignedUserId: data.assignedUserId,
      accountId: data.accountId,
      contactId: data.contactId,
      slaDueAt,
      isSlaBreached: false
    });

    await this.eventBus.publish({
      id: CryptoUtil.generateUuid(),
      name: 'TICKET_CREATED',
      tenantId,
      aggregateId: ticket.id,
      aggregateType: 'Ticket',
      timestamp: new Date().toISOString(),
      version: 1,
      payload: ticket
    });

    return ticket;
  }

  public async checkAndEscalateSla(tenantId: UUID, ticketId: UUID): Promise<ITicketEntity> {
    const ticket = await this.ticketRepo.getById(tenantId, ticketId);
    if (ticket.status === 'RESOLVED' || ticket.status === 'CLOSED') {
      return ticket;
    }

    if (ticket.slaDueAt && DateUtils.isPast(ticket.slaDueAt) && !ticket.isSlaBreached) {
      const updated = await this.ticketRepo.update(tenantId, ticketId, {
        isSlaBreached: true,
        priority: 'CRITICAL'
      });

      await this.eventBus.publish({
        id: CryptoUtil.generateUuid(),
        name: 'TICKET_SLA_BREACHED',
        tenantId,
        aggregateId: ticketId,
        aggregateType: 'Ticket',
        timestamp: new Date().toISOString(),
        version: 1,
        payload: { ticket: updated, breachedAt: new Date().toISOString() }
      });

      return updated;
    }

    return ticket;
  }

  public async listTickets(tenantId: UUID, params: PaginationParams): Promise<PaginatedResult<ITicketEntity>> {
    return this.ticketRepo.list(tenantId, params);
  }
}
`);

console.log('Phase 07 generated successfully!');
