const { WorkflowRepository } = require('../src/database/repositories/crm.repositories');
const { WorkflowEngine } = require('../src/modules/workflows/workflow.engine');

test('Workflow Engine: Should evaluate trigger conditions and fire actions', async () => {
  const workflowRepo = new WorkflowRepository();
  const engine = new WorkflowEngine(workflowRepo);

  await workflowRepo.create('tenant-test-01', {
    name: 'Auto-Assign Big Leads',
    isActive: true,
    triggerType: 'LEAD_CREATED',
    triggerConfig: {},
    conditions: [{ field: 'score', operator: 'gte', value: 80 }],
    actions: [{ type: 'ASSIGN_USER', target: 'SENIOR_REP' }]
  });

  const triggeredCount = await engine.processEvent({
    id: 'evt-1',
    name: 'LEAD_CREATED',
    tenantId: 'tenant-test-01',
    aggregateId: 'lead-1',
    aggregateType: 'Lead',
    timestamp: new Date().toISOString(),
    version: 1,
    payload: { score: 90, company: 'Google' }
  });

  assertEqual(triggeredCount, 1, 'Workflow should have triggered for lead score 90');
});
