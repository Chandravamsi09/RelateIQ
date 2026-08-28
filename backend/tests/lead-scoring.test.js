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
