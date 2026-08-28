import { UUID, ISODateString } from '../types/common.types';
import { ValidationError } from '../errors/app-error';

/**
 * Domain Entity: AccountEntity
 * Encapsulates core business invariants, self-validation, mutation guards, and domain events.
 */
export class AccountDomainEntity {
  private id: UUID;
  private tenantId: UUID;
  private name: string;
  private status: string;
  private version: number;
  private createdAt: ISODateString;
  private updatedAt: ISODateString;

  constructor(params: {
    id: UUID;
    tenantId: UUID;
    name?: string;
    status?: string;
    version?: number;
    createdAt?: ISODateString;
    updatedAt?: ISODateString;
  }) {
    if (!params.id) throw new ValidationError('Account ID cannot be empty');
    if (!params.tenantId) throw new ValidationError('Account Tenant ID cannot be empty');

    this.id = params.id;
    this.tenantId = params.tenantId;
    this.name = params.name || '';
    this.status = params.status || 'ACTIVE';
    this.version = params.version || 1;
    this.createdAt = params.createdAt || new Date().toISOString();
    this.updatedAt = params.updatedAt || new Date().toISOString();
  }

  public getId(): UUID { return this.id; }
  public getTenantId(): UUID { return this.tenantId; }
  public getName(): string { return this.name; }
  public getStatus(): string { return this.status; }
  public getVersion(): number { return this.version; }
  public getCreatedAt(): ISODateString { return this.createdAt; }
  public getUpdatedAt(): ISODateString { return this.updatedAt; }

  public updateName(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new ValidationError('Account name cannot be blank');
    }
    this.name = newName.trim();
    this.touch();
  }

  public setStatus(newStatus: string): void {
    this.status = newStatus;
    this.touch();
  }

  private touch(): void {
    this.version += 1;
    this.updatedAt = new Date().toISOString();
  }

  public toJSON(): Record<string, any> {
    return {
      id: this.id,
      tenantId: this.tenantId,
      name: this.name,
      status: this.status,
      version: this.version,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
