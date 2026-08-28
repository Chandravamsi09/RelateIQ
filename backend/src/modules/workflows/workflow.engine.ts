import { WorkflowRepository, IWorkflowEntity } from '../../database/repositories/crm.repositories';
import { UUID } from '../../core/types/common.types';
import { EventBus, DomainEvent } from '../../core/events/event-bus';
import { CryptoUtil } from '../../core/security/crypto';

export interface WorkflowCondition {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains';
  value: any;
}

export interface WorkflowAction {
  type: string;
  target?: string;
  title?: string;
  payload?: any;
}

export class WorkflowEngine {
  constructor(
    private workflowRepo: WorkflowRepository,
    private eventBus: EventBus = EventBus.getInstance()
  ) {
    this.registerEventSubscriptions();
  }

  private registerEventSubscriptions() {
    this.eventBus.subscribeAll(async (event: DomainEvent) => {
      await this.processEvent(event);
    });
  }

  public async processEvent(event: DomainEvent): Promise<number> {
    const workflows = await this.workflowRepo.list(event.tenantId, { limit: 100 }, (wf) => wf.isActive);
    let triggeredCount = 0;

    for (const wf of workflows.data) {
      if (this.matchesTrigger(wf, event)) {
        if (this.evaluateConditions(wf.conditions, event.payload)) {
          await this.executeActions(wf, event);
          triggeredCount++;
        }
      }
    }

    return triggeredCount;
  }

  private matchesTrigger(workflow: IWorkflowEntity, event: DomainEvent): boolean {
    if (workflow.triggerType === 'LEAD_CREATED' && event.name === 'LEAD_CREATED') return true;
    if (workflow.triggerType === 'DEAL_STAGE_CHANGED' && event.name === 'DEAL_STAGE_CHANGED') return true;
    if (workflow.triggerType === 'TICKET_CREATED' && event.name === 'TICKET_CREATED') return true;
    if (workflow.triggerType === 'TICKET_SLA_BREACHED' && event.name === 'TICKET_SLA_BREACHED') return true;
    return false;
  }

  private evaluateConditions(conditions: WorkflowCondition[], data: any): boolean {
    if (!conditions || conditions.length === 0) return true;
    for (const cond of conditions) {
      const val = data ? data[cond.field] : undefined;
      if (cond.operator === 'eq' && val !== cond.value) return false;
      if (cond.operator === 'neq' && val === cond.value) return false;
      if (cond.operator === 'gt' && !(val > cond.value)) return false;
      if (cond.operator === 'gte' && !(val >= cond.value)) return false;
      if (cond.operator === 'lt' && !(val < cond.value)) return false;
      if (cond.operator === 'lte' && !(val <= cond.value)) return false;
      if (cond.operator === 'contains') {
        if (!val || !String(val).toLowerCase().includes(String(cond.value).toLowerCase())) return false;
      }
    }
    return true;
  }

  private async executeActions(workflow: IWorkflowEntity, event: DomainEvent): Promise<void> {
    for (const action of workflow.actions) {
      await this.eventBus.publish({
        id: CryptoUtil.generateUuid(),
        name: 'WORKFLOW_ACTION_EXECUTED',
        tenantId: event.tenantId,
        aggregateId: workflow.id,
        aggregateType: 'Workflow',
        timestamp: new Date().toISOString(),
        version: 1,
        payload: {
          workflowId: workflow.id,
          workflowName: workflow.name,
          action,
          triggeredByEvent: event.name,
          sourceEntityId: event.aggregateId
        }
      });
    }
  }
}
