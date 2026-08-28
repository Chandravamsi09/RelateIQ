import { UUID } from '../../core/types/common.types';
import { BaseRepository, IBaseEntity } from '../../database/repositories/base.repository';

export interface ICustomFieldEntity extends IBaseEntity {
  entityType: string;
  fieldName: string;
  fieldLabel: string;
  fieldType: string;
  isRequired: boolean;
  options?: string[];
}

export class CustomFieldRepository extends BaseRepository<ICustomFieldEntity> {
  constructor() { super('CustomField'); }
}

export class CustomFieldService {
  constructor(private repo: CustomFieldRepository) {}

  public async defineField(tenantId: UUID, data: {
    entityType: string;
    fieldName: string;
    fieldLabel: string;
    fieldType: string;
    isRequired?: boolean;
    options?: string[];
  }): Promise<ICustomFieldEntity> {
    return this.repo.create(tenantId, {
      ...data,
      isRequired: data.isRequired || false
    });
  }

  public async getFieldsForEntity(tenantId: UUID, entityType: string): Promise<ICustomFieldEntity[]> {
    const list = await this.repo.list(tenantId, { limit: 100 }, (f) => f.entityType === entityType);
    return list.data;
  }
}
