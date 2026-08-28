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
