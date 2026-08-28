import { ContactRepository, AccountRepository, IContactEntity } from '../../database/repositories/crm.repositories';
import { UUID, PaginationParams, PaginatedResult } from '../../core/types/common.types';
import { EventBus } from '../../core/events/event-bus';
import { CryptoUtil } from '../../core/security/crypto';
import { ValidationError } from '../../core/errors/app-error';

export class ContactService {
  constructor(
    private contactRepo: ContactRepository,
    private accountRepo: AccountRepository,
    private eventBus: EventBus = EventBus.getInstance()
  ) {}

  public async createContact(tenantId: UUID, data: {
    accountId?: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    title?: string;
    isPrimary?: boolean;
    linkedinUrl?: string;
  }): Promise<IContactEntity> {
    if (!data.email || !data.firstName || !data.lastName) {
      throw new ValidationError('First name, last name, and valid email are required');
    }

    if (data.accountId) {
      await this.accountRepo.getById(tenantId, data.accountId);
    }

    const contact = await this.contactRepo.create(tenantId, {
      ...data,
      isPrimary: data.isPrimary || false
    });

    await this.eventBus.publish({
      id: CryptoUtil.generateUuid(),
      name: 'CONTACT_CREATED',
      tenantId,
      aggregateId: contact.id,
      aggregateType: 'Contact',
      timestamp: new Date().toISOString(),
      version: 1,
      payload: contact
    });

    return contact;
  }

  public async listContacts(tenantId: UUID, params: PaginationParams): Promise<PaginatedResult<IContactEntity>> {
    return this.contactRepo.list(tenantId, params);
  }
}
