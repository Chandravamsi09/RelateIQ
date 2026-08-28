const { DealRepository, LeadRepository, AccountRepository, TicketRepository } = require('../src/database/repositories/crm.repositories');
const { AnalyticsService } = require('../src/modules/analytics/analytics.service');

test('Analytics: Should calculate sales velocity equation metrics accurately', async () => {
  const dealRepo = new DealRepository();
  const leadRepo = new LeadRepository();
  const accountRepo = new AccountRepository();
  const ticketRepo = new TicketRepository();
  const analytics = new AnalyticsService(dealRepo, leadRepo, accountRepo, ticketRepo);

  await dealRepo.create('tenant-test-01', {
    pipelineId: 'p1',
    stageId: 's1',
    title: 'Deal 1',
    amount: 100000,
    probability: 100,
    status: 'WON'
  });

  const velocity = await analytics.getSalesVelocity('tenant-test-01');
  assert(velocity.salesVelocityPerDay > 0, 'Sales velocity should be positive');
});
