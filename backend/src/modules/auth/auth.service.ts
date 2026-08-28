import { UserRepository, TenantRepository, IUserEntity } from '../../database/repositories/crm.repositories';
import { CryptoUtil } from '../../core/security/crypto';
import { AuthenticationError, ValidationError, ConflictError } from '../../core/errors/app-error';
import { EventBus } from '../../core/events/event-bus';
import { TokenPair, UserContext, PermissionCode } from './auth.types';

export class AuthService {
  private activeSessions: Map<string, { userId: string; tenantId: string; createdAt: Date }> = new Map();

  constructor(
    private userRepo: UserRepository,
    private tenantRepo: TenantRepository,
    private eventBus: EventBus = EventBus.getInstance()
  ) {}

  public async registerTenantAndAdmin(data: {
    companyName: string;
    slug: string;
    adminEmail: string;
    password: string;
    adminFirstName: string;
    adminLastName: string;
  }): Promise<{ tenantId: string; user: IUserEntity; tokens: TokenPair }> {
    const existingTenant = await this.tenantRepo.findBySlug(data.slug);
    if (existingTenant) {
      throw new ConflictError('Tenant slug already exists');
    }

    const tenant = await this.tenantRepo.create('system-root', {
      name: data.companyName,
      slug: data.slug,
      status: 'ACTIVE',
      tier: 'PROFESSIONAL',
      maxUsers: 50,
      storageLimitMb: 10240,
      currency: 'USD',
      timezone: 'UTC'
    });

    const passwordHash = CryptoUtil.hashSha256(data.password);
    const user = await this.userRepo.create(tenant.id, {
      email: data.adminEmail.toLowerCase(),
      passwordHash,
      firstName: data.adminFirstName,
      lastName: data.adminLastName,
      title: 'Administrator',
      status: 'ACTIVE',
      twoFactorEnabled: false,
      roles: ['SUPER_ADMIN']
    });

    const tokens = await this.generateTokens(user);

    await this.eventBus.publish({
      id: CryptoUtil.generateUuid(),
      name: 'TENANT_REGISTERED',
      tenantId: tenant.id,
      aggregateId: tenant.id,
      aggregateType: 'Tenant',
      timestamp: new Date().toISOString(),
      version: 1,
      payload: { tenantName: tenant.name, adminEmail: user.email }
    });

    return { tenantId: tenant.id, user, tokens };
  }

  public async login(tenantId: string, email: string, password: string): Promise<{ user: IUserEntity; tokens: TokenPair }> {
    const user = await this.userRepo.findByEmail(tenantId, email);
    if (!user) {
      throw new AuthenticationError('Invalid email or password credentials');
    }

    const hash = CryptoUtil.hashSha256(password);
    if (user.passwordHash !== hash) {
      throw new AuthenticationError('Invalid email or password credentials');
    }

    if (user.status !== 'ACTIVE') {
      throw new AuthenticationError('User account is suspended or inactive');
    }

    const tokens = await this.generateTokens(user);
    return { user, tokens };
  }

  public async generateTokens(user: IUserEntity): Promise<TokenPair> {
    const sessionId = CryptoUtil.generateSecureToken(16);
    this.activeSessions.set(sessionId, {
      userId: user.id,
      tenantId: user.tenantId,
      createdAt: new Date()
    });

    const tokenPayload = {
      sub: user.id,
      tenantId: user.tenantId,
      email: user.email,
      roles: user.roles,
      sessionId
    };

    const accessToken = 'relateiq_jwt_' + Buffer.from(JSON.stringify(tokenPayload)).toString('base64');
    const refreshToken = CryptoUtil.generateSecureToken(32);

    return {
      accessToken,
      refreshToken,
      expiresInSeconds: 3600,
      tokenType: 'Bearer'
    };
  }

  public async validateToken(token: string): Promise<UserContext> {
    if (!token || !token.startsWith('Bearer ')) {
      throw new AuthenticationError('Invalid authorization token format');
    }

    const raw = token.replace('Bearer ', '').trim();
    if (!raw.startsWith('relateiq_jwt_')) {
      throw new AuthenticationError('Invalid or malformed token');
    }

    try {
      const decodedJson = Buffer.from(raw.replace('relateiq_jwt_', ''), 'base64').toString('utf8');
      const payload = JSON.parse(decodedJson);
      
      const allPermissions = Object.values(PermissionCode);
      return {
        userId: payload.sub,
        tenantId: payload.tenantId,
        email: payload.email,
        roles: payload.roles || [],
        permissions: allPermissions,
        sessionId: payload.sessionId
      };
    } catch {
      throw new AuthenticationError('Token expired or signature invalid');
    }
  }

  public hasPermission(userContext: UserContext, requiredPermission: PermissionCode): boolean {
    if (userContext.roles.includes('SUPER_ADMIN')) return true;
    return userContext.permissions.includes(requiredPermission);
  }
}
