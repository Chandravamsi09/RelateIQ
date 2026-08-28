const { TicketRepository } = require('../src/database/repositories/crm.repositories');
const { TicketService } = require('../src/modules/support/ticket.service');
const { DateUtils } = require('../src/core/utils/date-utils');

test('Support SLA: Should detect breached SLA and escalate priority to CRITICAL', async () => {
  const ticketRepo = new TicketRepository();
  const ticketService = new TicketService(ticketRepo);

  const ticket = await ticketService.createTicket('tenant-test-01', {
    subject: 'Production API Outage',
    description: 'API returning 500 error',
    priority: 'HIGH'
  });

  // Manually set SLA due in the past
  await ticketRepo.update('tenant-test-01', ticket.id, {
    slaDueAt: DateUtils.addHours(new Date(), -2).toISOString()
  });

  const escalated = await ticketService.checkAndEscalateSla('tenant-test-01', ticket.id);
  assertEqual(escalated.isSlaBreached, true);
  assertEqual(escalated.priority, 'CRITICAL');
});
