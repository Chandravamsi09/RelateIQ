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
