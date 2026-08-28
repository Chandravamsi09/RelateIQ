import { UserRepository, IUserEntity } from '../../database/repositories/crm.repositories';
import { UUID, PaginationParams, PaginatedResult } from '../../core/types/common.types';
import { CryptoUtil } from '../../core/security/crypto';
import { ValidationError, ConflictError, NotFoundError } from '../../core/errors/app-error';

export class UserService {
  constructor(private userRepo: UserRepository) {}

  public async createUser(tenantId: UUID, data: {
    email: string;
    firstName: string;
    lastName: string;
    title?: string;
    department?: string;
    roles?: string[];
    password?: string;
  }): Promise<IUserEntity> {
    const existing = await this.userRepo.findByEmail(tenantId, data.email);
    if (existing) throw new ConflictError('User email already exists in this tenant');

    const passwordHash = CryptoUtil.hashSha256(data.password || 'Welcome@123456');
    return this.userRepo.create(tenantId, {
      email: data.email.toLowerCase(),
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      title: data.title,
      department: data.department,
      status: 'ACTIVE',
      twoFactorEnabled: false,
      roles: data.roles || ['SALES_REP']
    });
  }

  public async listUsers(tenantId: UUID, params: PaginationParams): Promise<PaginatedResult<IUserEntity>> {
    return this.userRepo.list(tenantId, params);
  }
}
