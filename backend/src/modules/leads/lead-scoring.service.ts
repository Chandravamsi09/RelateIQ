import { ILeadEntity } from '../../database/repositories/crm.repositories';

export interface ScoringRule {
  field: keyof ILeadEntity;
  condition: 'equals' | 'contains' | 'greaterThan' | 'exists';
  targetValue: any;
  points: number;
}

export class LeadScoringService {
  private defaultRules: ScoringRule[] = [
    { field: 'company', condition: 'exists', targetValue: true, points: 15 },
    { field: 'phone', condition: 'exists', targetValue: true, points: 15 },
    { field: 'source', condition: 'equals', targetValue: 'REFERRAL', points: 30 },
    { field: 'source', condition: 'equals', targetValue: 'ORGANIC_SEARCH', points: 20 },
    { field: 'source', condition: 'equals', targetValue: 'CONFERENCE', points: 25 },
    { field: 'title', condition: 'contains', targetValue: 'VP', points: 20 },
    { field: 'title', condition: 'contains', targetValue: 'Director', points: 15 },
    { field: 'title', condition: 'contains', targetValue: 'Chief', points: 25 },
    { field: 'title', condition: 'contains', targetValue: 'CTO', points: 25 },
    { field: 'title', condition: 'contains', targetValue: 'CEO', points: 25 },
    { field: 'estimatedValue', condition: 'greaterThan', targetValue: 50000, points: 25 }
  ];

  public calculateScore(lead: Partial<ILeadEntity>): number {
    let score = 0;
    for (const rule of this.defaultRules) {
      const val = (lead as any)[rule.field];
      if (rule.condition === 'exists') {
        if (val !== undefined && val !== null && val !== '') score += rule.points;
      } else if (rule.condition === 'equals') {
        if (val === rule.targetValue) score += rule.points;
      } else if (rule.condition === 'contains') {
        if (typeof val === 'string' && val.toLowerCase().includes(String(rule.targetValue).toLowerCase())) {
          score += rule.points;
        }
      } else if (rule.condition === 'greaterThan') {
        if (typeof val === 'number' && val > Number(rule.targetValue)) {
          score += rule.points;
        }
      }
    }
    return Math.min(100, score);
  }
}
