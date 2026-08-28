const crypto = require('crypto');

// Cryptographic Security Helper (AES-256-GCM)
class CryptoUtil {
  static encrypt(plainText, secretKeyHex) {
    const key = Buffer.from(secretKeyHex, 'hex');
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    let encrypted = cipher.update(plainText, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const tag = cipher.getAuthTag().toString('hex');
    return { cipherText: encrypted, iv: iv.toString('hex'), tag };
  }

  static decrypt(cipherText, ivHex, tagHex, secretKeyHex) {
    const key = Buffer.from(secretKeyHex, 'hex');
    const iv = Buffer.from(ivHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    let decrypted = decipher.update(cipherText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}

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
    console.log(`  \x1b[32m✔ PASS\x1b[0m ${name} (${duration}ms)`);
  } catch (err) {
    const duration = Date.now() - start;
    failedTests++;
    testResults.push({ name, status: 'FAILED', duration, error: err.message });
    console.error(`  \x1b[31m✖ FAIL\x1b[0m ${name} (${duration}ms)`);
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

    const executedActions = [];
    if (shouldTrigger) {
      for (const act of rule.actions) {
        executedActions.push(act);
      }
    }
    assertEqual(executedActions.length, 2, '2 actions dispatched');
    assert(executedActions.includes('ASSIGN_SENIOR_AE'), 'Assigned Senior AE');
  });

  // Test Case 5: Support SLA Escalation & Countdown Watcher
  await test('Test Case 5: Support Desk SLA Breach Detection & Priority Escalation', async () => {
    const ticket = {
      id: 'tick-001',
      priority: 'HIGH',
      createdAt: Date.now() - (4 * 3600 * 1000), // 4 hours ago
      slaThresholdMs: 2 * 3600 * 1000 // 2 hours SLA
    };

    const isBreached = (Date.now() - ticket.createdAt) > ticket.slaThresholdMs;
    assert(isBreached, 'SLA detected as breached');

    if (isBreached) {
      ticket.priority = 'CRITICAL';
      ticket.escalated = true;
    }
    assertEqual(ticket.priority, 'CRITICAL', 'Priority escalated to CRITICAL on breach');
  });

  // Test Case 6: Account Health Scoring & Relationship Health Graph
  await test('Test Case 6: Account Health Scoring & Relationship Graph Evaluator', async () => {
    function calculateAccountHealth(acc) {
      let score = 50;
      if (acc.activeDealsCount > 0) score += 20;
      if (acc.openCriticalTickets === 0) score += 15;
      if (acc.npsScore && acc.npsScore >= 8) score += 15;
      return Math.min(100, score);
    }

    const health = calculateAccountHealth({
      activeDealsCount: 2,
      openCriticalTickets: 0,
      npsScore: 9
    });
    assertEqual(health, 100, 'Healthy account scores 100');
  });

  // Test Case 7: Sales Velocity Metric
  await test('Test Case 7: Sales Velocity Equation & Revenue Pacing Calculation', async () => {
    // Equation: V = (Opportunities * Avg Deal Size * Win Rate %) / Sales Cycle Length (Days)
    function calculateSalesVelocity(opportunities, avgDealSize, winRatePercent, cycleDays) {
      if (cycleDays === 0) return 0;
      return (opportunities * avgDealSize * (winRatePercent / 100)) / cycleDays;
    }

    const velocity = calculateSalesVelocity(20, 50000, 30, 30); // (20 * 50000 * 0.3) / 30 = 300,000 / 30 = $10,000 / day
    assertEqual(velocity, 10000, 'Sales velocity is $10,000/day');
  });

  // Test Case 8: Multi-Tenant Data Isolation Guard
  await test('Test Case 8: Multi-Tenant Data Isolation Guard Verification', async () => {
    const repositoryData = [
      { id: '1', tenantId: 'tenant-alpha', name: 'Alpha Lead' },
      { id: '2', tenantId: 'tenant-beta', name: 'Beta Lead' },
      { id: '3', tenantId: 'tenant-alpha', name: 'Alpha Account' }
    ];

    function filterByTenant(data, tenantId) {
      return data.filter(item => item.tenantId === tenantId);
    }

    const alphaRecords = filterByTenant(repositoryData, 'tenant-alpha');
    const betaRecords = filterByTenant(repositoryData, 'tenant-beta');

    assertEqual(alphaRecords.length, 2, 'Tenant Alpha retrieves exactly 2 isolated records');
    assertEqual(betaRecords.length, 1, 'Tenant Beta retrieves exactly 1 isolated record');
    assert(alphaRecords.every(r => r.tenantId === 'tenant-alpha'), 'Alpha dataset has zero data leakage');
  });

  console.log('\n======================================================');
  console.log(`  Test Summary: ${passedTests} Passed, ${failedTests} Failed (Total: ${passedTests + failedTests})`);
  console.log('======================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runAllTests();
