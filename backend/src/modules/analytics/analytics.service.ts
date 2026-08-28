import { DealRepository, LeadRepository, AccountRepository, TicketRepository, IDealEntity } from '../../database/repositories/crm.repositories';
import { UUID } from '../../core/types/common.types';
import { MathUtils } from '../../core/utils/math-utils';

export interface SalesVelocityMetrics {
  numberOfOpportunities: number;
  averageDealValue: number;
  winRatePercentage: number;
  averageSalesCycleDays: number;
  salesVelocityPerDay: number;
}

export interface PipelineForecast {
  totalPipelineValue: number;
  weightedForecastValue: number;
  commitValue: number;
  bestCaseValue: number;
  pipelineCount: number;
  averageProbability: number;
}

export class AnalyticsService {
  constructor(
    private dealRepo: DealRepository,
    private leadRepo: LeadRepository,
    private accountRepo: AccountRepository,
    private ticketRepo: TicketRepository
  ) {}

  public async getSalesVelocity(tenantId: UUID): Promise<SalesVelocityMetrics> {
    const deals = await this.dealRepo.list(tenantId, { limit: 1000 });
    const allDeals = deals.data;

    const wonDeals = allDeals.filter(d => d.status === 'WON');
    const closedDeals = allDeals.filter(d => d.status === 'WON' || d.status === 'LOST');

    const numberOfOpportunities = allDeals.length;
    const averageDealValue = allDeals.length > 0
      ? MathUtils.round(allDeals.reduce((sum, d) => sum + d.amount, 0) / allDeals.length, 2)
      : 0;

    const winRatePercentage = closedDeals.length > 0
      ? MathUtils.percentage(wonDeals.length, closedDeals.length, 2)
      : 50;

    const averageSalesCycleDays = 30; // 30-day standard sales cycle benchmark

    // Sales Velocity Equation: V = (Opportunities * Avg Value * Win Rate) / Sales Cycle Days
    const velocityPerDay = averageSalesCycleDays > 0
      ? MathUtils.round((numberOfOpportunities * averageDealValue * (winRatePercentage / 100)) / averageSalesCycleDays, 2)
      : 0;

    return {
      numberOfOpportunities,
      averageDealValue,
      winRatePercentage,
      averageSalesCycleDays,
      salesVelocityPerDay: velocityPerDay
    };
  }

  public async getPipelineForecast(tenantId: UUID): Promise<PipelineForecast> {
    const openDeals = await this.dealRepo.list(tenantId, { limit: 1000 }, (d) => d.status === 'OPEN');
    const deals = openDeals.data;

    let totalPipelineValue = 0;
    let weightedForecastValue = 0;
    let commitValue = 0;
    let bestCaseValue = 0;
    let totalProbability = 0;

    for (const deal of deals) {
      totalPipelineValue += deal.amount;
      const weighted = deal.amount * (deal.probability / 100);
      weightedForecastValue += weighted;
      totalProbability += deal.probability;

      if (deal.probability >= 80) commitValue += deal.amount;
      if (deal.probability >= 40) bestCaseValue += deal.amount;
    }

    const averageProbability = deals.length > 0
      ? MathUtils.round(totalProbability / deals.length, 1)
      : 0;

    return {
      totalPipelineValue: MathUtils.round(totalPipelineValue, 2),
      weightedForecastValue: MathUtils.round(weightedForecastValue, 2),
      commitValue: MathUtils.round(commitValue, 2),
      bestCaseValue: MathUtils.round(bestCaseValue, 2),
      pipelineCount: deals.length,
      averageProbability
    };
  }

  public async getExecutiveOverview(tenantId: UUID) {
    const [deals, leads, accounts, tickets, forecast, velocity] = await Promise.all([
      this.dealRepo.count(tenantId),
      this.leadRepo.count(tenantId),
      this.accountRepo.count(tenantId),
      this.ticketRepo.count(tenantId),
      this.getPipelineForecast(tenantId),
      this.getSalesVelocity(tenantId)
    ]);

    return {
      totalDeals: deals,
      totalLeads: leads,
      totalAccounts: accounts,
      openTickets: tickets,
      forecast,
      velocity
    };
  }
}
