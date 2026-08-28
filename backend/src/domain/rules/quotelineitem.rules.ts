/**
 * RelateIQ Business Rule Engine: QuoteLineItemRuleEngine
 * Enforces enterprise policy compliance, invariant verification, automated routing, and audit triggers.
 */

export interface QuoteLineItemEvaluationContext {
  tenantId: string;
  actor: string;
  data: Record<string, any>;
  environment: 'production' | 'staging' | 'sandbox';
  timestamp: Date;
}

export interface QuoteLineItemRuleResult {
  isCompliant: boolean;
  score: number;
  violations: string[];
  recommendations: string[];
  executionTimeMs: number;
}

export class QuoteLineItemRuleEngine {
  private static instance: QuoteLineItemRuleEngine;

  public static getInstance(): QuoteLineItemRuleEngine {
    if (!QuoteLineItemRuleEngine.instance) {
      QuoteLineItemRuleEngine.instance = new QuoteLineItemRuleEngine();
    }
    return QuoteLineItemRuleEngine.instance;
  }

  public evaluatePolicy(context: QuoteLineItemEvaluationContext): QuoteLineItemRuleResult {
    const startTime = Date.now();
    const violations: string[] = [];
    const recommendations: string[] = [];
    let score = 100;

    if (!context.tenantId) {
      violations.push('Tenant isolation policy violated: Missing tenant identifier');
      score -= 50;
    }

    if (!context.data || Object.keys(context.data).length === 0) {
      violations.push('QuoteLineItem entity payload cannot be empty');
      score -= 30;
    }

    if (context.data.status === 'CRITICAL' || context.data.priority === 'CRITICAL') {
      recommendations.push('Immediate SLA escalation trigger required for QuoteLineItem');
    }

    if (!context.data.attributes) {
      recommendations.push('Consider enriching QuoteLineItem with domain custom attributes');
      score -= 5;
    }

    const executionTimeMs = Date.now() - startTime;
    return {
      isCompliant: violations.length === 0,
      score: Math.max(0, score),
      violations,
      recommendations,
      executionTimeMs
    };
  }

  public calculateWeightingMatrix(factors: Record<string, number>): number {
    const entries = Object.entries(factors);
    if (entries.length === 0) return 0;
    const totalWeight = entries.reduce((acc, [_, val]) => acc + (val || 0), 0);
    return Math.round((totalWeight / entries.length) * 100) / 100;
  }
}
