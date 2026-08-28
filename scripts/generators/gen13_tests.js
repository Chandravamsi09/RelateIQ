const { save } = require('./writer');

console.log('Generating Phase 13: Comprehensive Automated Testing Suite...');

// 1. Test Runner
save('backend/tests/runner.js', `
const fs = require('fs');
const path = require('path');

let passedTests = 0;
let failedTests = 0;
const testResults = [];

function assert(condition, message) {
  if (!condition) {
    throw new Error('Assertion Failed: ' + message);
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(\`\${message || 'Equality failed'} (Expected: \${expected}, Received: \${actual})\`);
  }
}

async function test(name, fn) {
  const start = Date.now();
  try {
    await fn();
    const duration = Date.now() - start;
    passedTests++;
    testResults.push({ name, status: 'PASSED', duration });
    console.log(\`  \x1b[32m? PASS\x1b[0m \${name} (\${duration}ms)\`);
  } catch (err) {
    const duration = Date.now() - start;
    failedTests++;
    testResults.push({ name, status: 'FAILED', duration, error: err.message });
    console.error(\`  \x1b[31m? FAIL\x1b[0m \${name} (\${duration}ms)\`);
    console.error(\`    \x1b[31m\${err.message}\x1b[0m\`);
  }
}

global.test = test;
global.assert = assert;
global.assertEqual = assertEqual;

async function runAllTests() {
  console.log('\\n======================================================');
  console.log('  RelateIQ Enterprise CRM - Automated Test Suite');
  console.log('======================================================\\n');

  require('./auth.test.js');
  require('./lead-scoring.test.js');
  require('./lead-conversion.test.js');
  require('./deal-pipeline.test.js');
  require('./workflow-engine.test.js');
  require('./sla-escalation.test.js');
  require('./account-health.test.js');
  require('./sales-velocity.test.js');
  require('./crypto-security.test.js');

  // Allow async tasks
  setTimeout(() => {
    console.log('\\n======================================================');
    console.log(\`  Test Summary: \x1b[32m\${passedTests} Passed\x1b[0m, \x1b[31m\${failedTests} Failed\x1b[0m (Total: \${passedTests + failedTests})\`);
    console.log('======================================================\\n');
    if (failedTests > 0) process.exit(1);
  }, 500);
}

runAllTests();
`);

// 2. Auth Tests
save('backend/tests/auth.test.js', `
const { TenantRepository, UserRepository } = require('../src/database/repositories/crm.repositories');
const { AuthService } = require('../src/modules/auth/auth.service');
const { RBACService } = require('../src/modules/auth/rbac.service');

test('Auth: Should register tenant and generate JWT tokens', async () => {
  const tenantRepo = new TenantRepository();
  const userRepo = new UserRepository();
  const authService = new AuthService(userRepo, tenantRepo);

  const result = await authService.registerTenantAndAdmin({
    companyName: 'Stark Industries',
    slug: 'stark-ind',
    adminEmail: 'tony@stark.com',
    password: 'Password@123',
    adminFirstName: 'Tony',
    adminLastName: 'Stark'
  });

  assert(result.tenantId, 'Tenant ID must be defined');
  assertEqual(result.user.email, 'tony@stark.com');
  assert(result.tokens.accessToken.startsWith('relateiq_jwt_'), 'Valid JWT generated');
});

test('RBAC: Should enforce role-based access permissions', async () => {
  const rbac = new RBACService();
  const userContext = {
    userId: 'u1',
    tenantId: 't1',
    email: 'rep@stark.com',
    roles: ['SALES_REP'],
    permissions: [],
    sessionId: 's1'
  };

  const perms = rbac.getPermissionsForRoles(userContext.roles);
  assert(perms.includes('deal:create'), 'Sales rep can create deals');
  assert(!perms.includes('tenant:update'), 'Sales rep cannot update tenant settings');
});
`);

// 3. Lead Scoring & Conversion Tests
save('backend/tests/lead-scoring.test.js', `
const { LeadScoringService } = require('../src/modules/leads/lead-scoring.service');

test('Lead Scoring: Should compute intelligent lead score based on source & title', async () => {
  const scorer = new LeadScoringService();
  const score = scorer.calculateScore({
    company: 'Palantir Technologies',
    phone: '+1-555-0199',
    source: 'REFERRAL',
    title: 'VP of Engineering',
    estimatedValue: 75000
  });

  assert(score >= 80, 'High value referral VP should score >= 80 (Actual: ' + score + ')');
});
`);

save('backend/tests/lead-conversion.test.js', `
const { LeadRepository, AccountRepository, ContactRepository, DealRepository } = require('../src/database/repositories/crm.repositories');
const { LeadService } = require('../src/modules/leads/lead.service');

test('Lead Conversion: Should atomically convert lead to Account, Contact, and Deal', async () => {
  const leadRepo = new LeadRepository();
  const accountRepo = new AccountRepository();
  const contactRepo = new ContactRepository();
  const dealRepo = new DealRepository();
  const leadService = new LeadService(leadRepo, accountRepo, contactRepo, dealRepo);

  const lead = await leadService.createLead('tenant-test-01', {
    firstName: 'Bruce',
    lastName: 'Wayne',
    company: 'Wayne Enterprises',
    email: 'bruce@waynecorp.com',
    title: 'Chairman',
    estimatedValue: 250000
  });

  const converted = await leadService.convertLead('tenant-test-01', lead.id, {
    dealTitle: 'Wayne Enterprises Enterprise Security'
  });

  assertEqual(converted.lead.status, 'CONVERTED');
  assertEqual(converted.account.name, 'Wayne Enterprises');
  assertEqual(converted.contact.email, 'bruce@waynecorp.com');
  assertEqual(converted.deal.amount, 250000);
});
`);

// 4. Deal Pipeline Tests
save('backend/tests/deal-pipeline.test.js', `
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
`);

// 5. Workflow Engine Tests
save('backend/tests/workflow-engine.test.js', `
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
`);

// 6. SLA Escalation Tests
save('backend/tests/sla-escalation.test.js', `
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
`);

// 7. Account Health & Analytics Tests
save('backend/tests/account-health.test.js', `
const { AccountRepository, ContactRepository } = require('../src/database/repositories/crm.repositories');
const { AccountService } = require('../src/modules/accounts/account.service');

test('Account Health: Should compute holistic health score from revenue & contacts', async () => {
  const accRepo = new AccountRepository();
  const conRepo = new ContactRepository();
  const accService = new AccountService(accRepo, conRepo);

  const acc = await accService.createAccount('tenant-test-01', {
    name: 'Cyberdyne Systems',
    annualRevenue: 5000000,
    website: 'https://cyberdyne.com',
    phone: '+1-555-0100'
  });

  await conRepo.create('tenant-test-01', {
    accountId: acc.id,
    firstName: 'Miles',
    lastName: 'Dyson',
    email: 'miles@cyberdyne.com',
    isPrimary: true
  });

  const score = await accService.calculateHealthScore('tenant-test-01', acc.id);
  assert(score >= 80, 'Healthy enterprise account score should be >= 80');
});
`);

save('backend/tests/sales-velocity.test.js', `
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
`);

save('backend/tests/crypto-security.test.js', `
const { CryptoUtil } = require('../src/core/security/crypto');

test('Security & Crypto: Should encrypt and decrypt payload with AES-256-GCM', async () => {
  const secretKey = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
  const plainText = 'Sensitive CRM Customer Financial Data';

  const encrypted = CryptoUtil.encrypt(plainText, secretKey);
  const decrypted = CryptoUtil.decrypt(encrypted.cipherText, encrypted.iv, encrypted.tag, secretKey);

  assertEqual(decrypted, plainText);
});
`);

console.log('Phase 13 generated successfully!');
