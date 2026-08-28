const { DealRepository } = require('../src/database/repositories/crm.repositories');
const { DealService } = require('../src/modules/deals/deal.service');

test('Deal Pipeline: Should transition deal stages and automatically set won status', async () => {
  const dealRepo = new DealRepository();
  const dealService = new DealService(dealRepo);

  const deal = await dealService.createDeal('tenant-test-01', {
    pipelineId: 'pipe-01',
    stageId: 'stage-proposal',
    title: 'Cloud Migration',
    amount: 150000,
    probability: 60
  });

  const wonDeal = await dealService.updateStage('tenant-test-01', deal.id, 'stage-won');
  assertEqual(wonDeal.status, 'WON');
  assertEqual(wonDeal.probability, 100);
  assert(wonDeal.wonAt !== undefined, 'wonAt date set');
});
