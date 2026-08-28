import { ActivityRepository, IActivityEntity } from '../../database/repositories/crm.repositories';
import { UUID, PaginationParams, PaginatedResult } from '../../core/types/common.types';
import { EventBus } from '../../core/events/event-bus';
import { CryptoUtil } from '../../core/security/crypto';
import { ValidationError } from '../../core/errors/app-error';

export class ActivityService {
  constructor(
    private activityRepo: ActivityRepository,
    private eventBus: EventBus = EventBus.getInstance()
  ) {}

  public async createActivity(tenantId: UUID, data: {
    type: string;
    subject: string;
    description?: string;
    priority?: string;
    dueDate?: string;
    startDate?: string;
    endDate?: string;
    assignedUserId?: string;
    accountId?: string;
    contactId?: string;
    leadId?: string;
    dealId?: string;
  }): Promise<IActivityEntity> {
    if (!data.subject || !data.type) {
      throw new ValidationError('Activity subject and type are required');
    }

    const activity = await this.activityRepo.create(tenantId, {
      ...data,
      priority: data.priority || 'MEDIUM',
      status: 'PENDING'
    });

    await this.eventBus.publish({
      id: CryptoUtil.generateUuid(),
      name: 'ACTIVITY_CREATED',
      tenantId,
      aggregateId: activity.id,
      aggregateType: 'Activity',
      timestamp: new Date().toISOString(),
      version: 1,
      payload: activity
    });

    return activity;
  }

  public async completeActivity(tenantId: UUID, activityId: UUID): Promise<IActivityEntity> {
    const updated = await this.activityRepo.update(tenantId, activityId, {
      status: 'COMPLETED',
      completedAt: new Date().toISOString()
    });

    await this.eventBus.publish({
      id: CryptoUtil.generateUuid(),
      name: 'ACTIVITY_COMPLETED',
      tenantId,
      aggregateId: activityId,
      aggregateType: 'Activity',
      timestamp: new Date().toISOString(),
      version: 1,
      payload: updated
    });

    return updated;
  }

  public async listActivities(tenantId: UUID, params: PaginationParams): Promise<PaginatedResult<IActivityEntity>> {
    return this.activityRepo.list(tenantId, params);
  }
}
