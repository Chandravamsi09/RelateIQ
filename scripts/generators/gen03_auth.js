const { save } = require('./writer');

console.log('Generating Phase 03: Multi-Tenant Authentication & RBAC Engine...');

// 1. Auth Types & Permissions
save('backend/src/modules/auth/auth.types.ts', `
import { UUID, ISODateString } from '../../core/types/common.types';

export enum PermissionCode {
  TENANT_VIEW = 'tenant:view',
  TENANT_UPDATE = 'tenant:update',
  USER_VIEW = 'user:view',
  USER_CREATE = 'user:create',
  USER_UPDATE = 'user:update',
  USER_DELETE = 'user:delete',
  ROLE_VIEW = 'role:view',
  ROLE_MANAGE = 'role:manage',
  ACCOUNT_VIEW = 'account:view',
  ACCOUNT_CREATE = 'account:create',
  ACCOUNT_UPDATE = 'account:update',
  ACCOUNT_DELETE = 'account:delete',
  CONTACT_VIEW = 'contact:view',
  CONTACT_CREATE = 'contact:create',
  CONTACT_UPDATE = 'contact:update',
  CONTACT_DELETE = 'contact:delete',
  LEAD_VIEW = 'lead:view',
  LEAD_CREATE = 'lead:create',
  LEAD_UPDATE = 'lead:update',
  LEAD_DELETE = 'lead:delete',
  LEAD_CONVERT = 'lead:convert',
  DEAL_VIEW = 'deal:view',
  DEAL_CREATE = 'deal:create',
  DEAL_UPDATE = 'deal:update',
  DEAL_DELETE = 'deal:delete',
  DEAL_CHANGE_STAGE = 'deal:change_stage',
  ACTIVITY_VIEW = 'activity:view',
  ACTIVITY_CREATE = 'activity:create',
  ACTIVITY_UPDATE = 'activity:update',
  ACTIVITY_DELETE = 'activity:delete',
  TICKET_VIEW = 'ticket:view',
  TICKET_CREATE = 'ticket:create',
  TICKET_UPDATE = 'ticket:update',
  TICKET_DELETE = 'ticket:delete',
  TICKET_ESCALATE = 'ticket:escalate',
  WORKFLOW_VIEW = 'workflow:view',
  WORKFLOW_MANAGE = 'workflow:manage',
  ANALYTICS_VIEW = 'analytics:view',
  ANALYTICS_EXPORT = 'analytics:export',
  AUDIT_VIEW = 'audit:view',
  SETTINGS_MANAGE = 'settings:manage'
}

export interface UserContext {
  userId: UUID;
  tenantId: UUID;
  email: string;
  roles: string[];
  permissions: string[];
  sessionId: string;
}

export interface JwtPayload {
  sub: UUID;
  tenantId: UUID;
  email: string;
  roles: string[];
  permissions: string[];
  sessionId: string;
  iat: number;
  exp: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresInSeconds: number;
  tokenType: 'Bearer';
}
`);

// 2. Auth Service
save('backend/src/modules/auth/auth.service.ts', `
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
`);

// 3. RBAC Evaluator
save('backend/src/modules/auth/rbac.service.ts', `
import { PermissionCode, UserContext } from './auth.types';
import { ForbiddenError } from '../../core/errors/app-error';

export class RBACService {
  private rolePermissionsMap: Map<string, PermissionCode[]> = new Map();

  constructor() {
    this.initDefaultRoles();
  }

  private initDefaultRoles() {
    this.rolePermissionsMap.set('SUPER_ADMIN', Object.values(PermissionCode));
    this.rolePermissionsMap.set('SALES_DIRECTOR', [
      PermissionCode.ACCOUNT_VIEW, PermissionCode.ACCOUNT_CREATE, PermissionCode.ACCOUNT_UPDATE,
      PermissionCode.CONTACT_VIEW, PermissionCode.CONTACT_CREATE, PermissionCode.CONTACT_UPDATE,
      PermissionCode.LEAD_VIEW, PermissionCode.LEAD_CREATE, PermissionCode.LEAD_UPDATE, PermissionCode.LEAD_CONVERT,
      PermissionCode.DEAL_VIEW, PermissionCode.DEAL_CREATE, PermissionCode.DEAL_UPDATE, PermissionCode.DEAL_CHANGE_STAGE,
      PermissionCode.ACTIVITY_VIEW, PermissionCode.ACTIVITY_CREATE, PermissionCode.ACTIVITY_UPDATE,
      PermissionCode.ANALYTICS_VIEW, PermissionCode.ANALYTICS_EXPORT
    ]);
    this.rolePermissionsMap.set('SALES_REP', [
      PermissionCode.ACCOUNT_VIEW,
      PermissionCode.CONTACT_VIEW, PermissionCode.CONTACT_CREATE,
      PermissionCode.LEAD_VIEW, PermissionCode.LEAD_CREATE, PermissionCode.LEAD_UPDATE, PermissionCode.LEAD_CONVERT,
      PermissionCode.DEAL_VIEW, PermissionCode.DEAL_CREATE, PermissionCode.DEAL_UPDATE, PermissionCode.DEAL_CHANGE_STAGE,
      PermissionCode.ACTIVITY_VIEW, PermissionCode.ACTIVITY_CREATE, PermissionCode.ACTIVITY_UPDATE
    ]);
    this.rolePermissionsMap.set('SUPPORT_AGENT', [
      PermissionCode.ACCOUNT_VIEW, PermissionCode.CONTACT_VIEW,
      PermissionCode.TICKET_VIEW, PermissionCode.TICKET_CREATE, PermissionCode.TICKET_UPDATE, PermissionCode.TICKET_ESCALATE,
      PermissionCode.ACTIVITY_VIEW, PermissionCode.ACTIVITY_CREATE
    ]);
  }

  public getPermissionsForRoles(roles: string[]): PermissionCode[] {
    const permissions = new Set<PermissionCode>();
    for (const role of roles) {
      const list = this.rolePermissionsMap.get(role) || [];
      for (const p of list) permissions.add(p);
    }
    return Array.from(permissions);
  }

  public enforce(user: UserContext, permission: PermissionCode): void {
    if (user.roles.includes('SUPER_ADMIN')) return;
    const userPerms = this.getPermissionsForRoles(user.roles);
    if (!userPerms.includes(permission)) {
      throw new ForbiddenError('Access denied: missing required permission ' + permission);
    }
  }
}
`);

console.log('Phase 03 generated successfully!');
