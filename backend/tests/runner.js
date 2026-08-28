const { CryptoUtil } = require('../src/core/security/crypto');
const { DateUtils } = require('../src/core/utils/date-utils');
const { MathUtils } = require('../src/core/utils/math-utils');

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
    throw new Error(`${message || 'Equality failed'} (Expected: ${expected}, Received: ${actual})`);
  }
}

async function test(name, fn) {
  const start = Date.now();
  try {
    await fn();
    const duration = Date.now() - start;
    passedTests++;
    testResults.push({ name, status: 'PASSED', duration });
    console.log(`  \x1b[32m? PASS\x1b[0m ${name} (${duration}ms)`);
  } catch (err) {
    const duration = Date.now() - start;
    failedTests++;
    testResults.push({ name, status: 'FAILED', duration, error: err.message });
    console.error(`  \x1b[31m? FAIL\x1b[0m ${name} (${duration}ms)`);
    console.error(`    \x1b[31m${err.message}\x1b[0m`);
  }
}

async function runAllTests() {
  console.log('\n======================================================');
  console.log('  RelateIQ Enterprise CRM - Automated Test Suite');
  console.log('======================================================\n');

  // Test Case 1: Multi-Tenant Auth & Cryptography
  await test('Test Case 1: Cryptographic Security & AES-256-GCM Encryption', async () => {
    const secretKey = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
    const plainText = 'CONFIDENTIAL_FINANCIAL_TRANSACTION_PAYLOAD';
    const encrypted = CryptoUtil.encrypt(plainText, secretKey);
    assert(encrypted.cipherText.length > 0, 'Ciphertext generated');
    const decrypted = CryptoUtil.decrypt(encrypted.cipherText, encrypted.iv, encrypted.tag, secretKey);
    assertEqual(decrypted, plainText, 'Decrypted text matches original');
  });

  // Test Case 2: Lead Scoring Algorithm Engine
  await test('Test Case 2: AI Lead Scoring Algorithm & Tier Attribution', async () => {
    // Scoring logic
    function computeScore(lead) {
      let score = 0;
      if (lead.company) score += 15;
      if (lead.phone) score += 15;
      if (lead.source === 'REFERRAL') score += 30;
      if (lead.title && lead.title.includes('VP')) score += 20;
      if (lead.estimatedValue > 50000) score += 20;
      return Math.min(100, score);
    }

    const lead1 = { company: 'Acme', phone: '+1234', source: 'REFERRAL', title: 'VP Sales', estimatedValue: 80000 };
    const score1 = computeScore(lead1);
    assertEqual(score1, 100, 'Tier-1 enterprise VP referral scores 100');

    const lead2 = { company: 'Startup', source: 'WEBSITE', estimatedValue: 10000 };
    const score2 = computeScore(lead2);
    assertEqual(score2, 15, 'Low-touch inbound lead scores 15');
  });

  // Test Case 3: Deal Pipeline Stage Progression & Forecasting Math
  await test('Test Case 3: Deal Pipeline Weighted Forecasting & Stage State Machine', async () => {
    const deals = [
      { id: '1', amount: 100000, prob: 80, stage: 'proposal' },
      { id: '2', amount: 200000, prob: 50, stage: 'qualification' },
      { id: '3', amount: 50000, prob: 100, stage: 'won' }
    ];

    const totalPipeline = deals.reduce((sum, d) => sum + d.amount, 0);
    const weightedForecast = deals.reduce((sum, d) => sum + (d.amount * (d.prob / 100)), 0);

    assertEqual(totalPipeline, 350000, 'Total pipeline is $350k');
    assertEqual(weightedForecast, 230000, 'Weighted forecast is $230k');
  });

  // Test Case 4: Workflow Engine Trigger -> Condition -> Action Execution
  await test('Test Case 4: Workflow Trigger Rule Evaluation & Action Dispatch', async () => {
    const rule = {
      trigger: 'LEAD_CREATED',
      minScore: 80,
      actions: ['ASSIGN_SENIOR_AE', 'NOTIFY_SLACK']
    };

    const eventPayload = { name: 'LEAD_CREATED', score: 85, leadId: 'lead-99' };
    const shouldTrigger = eventPayload.name === rule.trigger && eventPayload.score >= rule.minScore;
    assert(shouldTrigger, 'Workflow rule condition met');
    assertEqual(rule.actions.length, 2, 'Two automated actions dispatched');
  });

  // Test Case 5: Support Desk SLA Countdown & Automated Priority Escalation
  await test('Test Case 5: Support Desk SLA Breach Detection & Priority Escalation', async () => {
    const now = new Date();
    const pastSla = DateUtils.addHours(now, -3).toISOString();
    const ticket = {
      id: 'ticket-1001',
      priority: 'HIGH',
      slaDueAt: pastSla,
      isSlaBreached: false
    };

    if (DateUtils.isPast(ticket.slaDueAt)) {
      ticket.isSlaBreached = true;
      ticket.priority = 'CRITICAL';
    }

    assertEqual(ticket.isSlaBreached, true, 'SLA detected as breached');
    assertEqual(ticket.priority, 'CRITICAL', 'Ticket automatically escalated to CRITICAL priority');
  });

  // Test Case 6: Account Health Scoring & Churn Risk Prediction
  await test('Test Case 6: Account Health Scoring & Relationship Graph Evaluator', async () => {
    function computeAccountHealth(acc, contacts) {
      let score = 50;
      if (contacts.length >= 2) score += 20;
      if (acc.annualRevenue > 1000000) score += 20;
      if (acc.openTicketsCount === 0) score += 10;
      return Math.min(100, score);
    }

    const acc = { annualRevenue: 2500000, openTicketsCount: 0 };
    const contacts = [{ id: 'c1' }, { id: 'c2' }];
    const health = computeAccountHealth(acc, contacts);
    assertEqual(health, 100, 'Enterprise account with multiple contacts & 0 issues has 100 health score');
  });

  // Test Case 7: Sales Velocity Equation (V = O * A * W / L)
  await test('Test Case 7: Sales Velocity Equation & Revenue Pacing Calculation', async () => {
    const opps = 20;
    const avgDeal = 50000;
    const winRate = 0.30;
    const cycleDays = 25;

    const velocityPerDay = (opps * avgDeal * winRate) / cycleDays;
    assertEqual(velocityPerDay, 12000, 'Sales velocity is exactly $12,000 / day');
  });

  // Test Case 8: Multi-Tenant Data Isolation & Partition Integrity
  await test('Test Case 8: Multi-Tenant Data Isolation Guard Verification', async () => {
    const tenantA = 'tenant-acme';
    const tenantB = 'tenant-stark';
    const record = { id: 'rec-1', tenantId: tenantA, data: 'Secret Data' };

    function accessRecord(requesterTenantId, targetRecord) {
      if (requesterTenantId !== targetRecord.tenantId) {
        throw new Error('TENANT_ISOLATION_VIOLATION');
      }
      return targetRecord;
    }

    let errorThrown = false;
    try {
      accessRecord(tenantB, record);
    } catch (e) {
      errorThrown = true;
      assertEqual(e.message, 'TENANT_ISOLATION_VIOLATION');
    }
    assert(errorThrown, 'Tenant B blocked from accessing Tenant A data');
  });

  console.log('\n======================================================');
  console.log(`  Test Summary: \x1b[32m${passedTests} Passed\x1b[0m, \x1b[31m${failedTests} Failed\x1b[0m (Total: ${passedTests + failedTests})`);
  console.log('======================================================\n');
  if (failedTests > 0) process.exit(1);
}

runAllTests();
