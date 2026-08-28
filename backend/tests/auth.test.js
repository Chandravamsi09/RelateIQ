const { TenantRepository, UserRepository } = require('../src/database/repositories/crm.repositories');
const { AuthService } = require('../src/modules/auth/auth.service');
const { RBACService } = require('../src/modules/auth/rbac.service');

test('Auth: Should register tenant and generate JWT tokens', async () => {
  const tenantRepo = new TenantRepository();
  const userRepo = new UserRepository();
  const authService = new AuthService(userRepo, tenantRepo);

  const result = await authService.registerTenantAndAdmin({
    companyName: 'Stark Industries',
    slug: 'stark-ind',
    adminEmail: 'tony@stark.com',
    password: 'Password@123',
    adminFirstName: 'Tony',
    adminLastName: 'Stark'
  });

  assert(result.tenantId, 'Tenant ID must be defined');
  assertEqual(result.user.email, 'tony@stark.com');
  assert(result.tokens.accessToken.startsWith('relateiq_jwt_'), 'Valid JWT generated');
});

test('RBAC: Should enforce role-based access permissions', async () => {
  const rbac = new RBACService();
  const userContext = {
    userId: 'u1',
    tenantId: 't1',
    email: 'rep@stark.com',
    roles: ['SALES_REP'],
    permissions: [],
    sessionId: 's1'
  };

  const perms = rbac.getPermissionsForRoles(userContext.roles);
  assert(perms.includes('deal:create'), 'Sales rep can create deals');
  assert(!perms.includes('tenant:update'), 'Sales rep cannot update tenant settings');
});
