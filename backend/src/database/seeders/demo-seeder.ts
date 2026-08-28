import { TenantRepository, UserRepository, AccountRepository, ContactRepository, LeadRepository, DealRepository, ActivityRepository, TicketRepository, WorkflowRepository } from '../repositories/crm.repositories';
import { CryptoUtil } from '../../core/security/crypto';

export class DemoSeeder {
  public static async seedAll(
    tenantRepo: TenantRepository,
    userRepo: UserRepository,
    accountRepo: AccountRepository,
    contactRepo: ContactRepository,
    leadRepo: LeadRepository,
    dealRepo: DealRepository,
    activityRepo: ActivityRepository,
    ticketRepo: TicketRepository,
    workflowRepo: WorkflowRepository
  ): Promise<{ tenantId: string; adminUserId: string }> {
    const tenant = await tenantRepo.create('system-root', {
      id: 'tenant-acme-corp',
      name: 'Acme Global Enterprises',
      slug: 'acme-global',
      status: 'ACTIVE',
      tier: 'ENTERPRISE',
      maxUsers: 100,
      storageLimitMb: 51200,
      currency: 'USD',
      timezone: 'America/New_York'
    });

    const passwordHash = CryptoUtil.hashSha256('Admin@123456');
    const adminUser = await userRepo.create(tenant.id, {
      id: 'user-admin-01',
      email: 'admin@acmecorp.com',
      passwordHash,
      firstName: 'Alexander',
      lastName: 'Pierce',
      title: 'Chief Revenue Officer',
      department: 'Executive',
      status: 'ACTIVE',
      twoFactorEnabled: false,
      roles: ['SUPER_ADMIN', 'SALES_DIRECTOR']
    });

    const salesRep = await userRepo.create(tenant.id, {
      id: 'user-sales-01',
      email: 'sarah.connor@acmecorp.com',
      passwordHash,
      firstName: 'Sarah',
      lastName: 'Connor',
      title: 'Senior Enterprise AE',
      department: 'Sales',
      status: 'ACTIVE',
      twoFactorEnabled: false,
      roles: ['SALES_REP']
    });

    const acc1 = await accountRepo.create(tenant.id, {
      id: 'acc-techflow-01',
      name: 'TechFlow Solutions Inc.',
      industry: 'Software & Technology',
      website: 'https://techflow.io',
      phone: '+1-415-555-0199',
      annualRevenue: 45000000,
      employeeCount: 420,
      rating: 'HOT',
      healthScore: 92,
      billingCity: 'San Francisco',
      billingCountry: 'United States'
    });

    const con1 = await contactRepo.create(tenant.id, {
      id: 'con-elena-01',
      accountId: acc1.id,
      firstName: 'Elena',
      lastName: 'Rostova',
      email: 'elena.rostova@techflow.io',
      phone: '+1-415-555-0188',
      title: 'VP of Technology',
      isPrimary: true,
      linkedinUrl: 'https://linkedin.com/in/elena-rostova-tech'
    });

    await leadRepo.create(tenant.id, {
      id: 'lead-quantum-01',
      assignedUserId: salesRep.id,
      firstName: 'Sophia',
      lastName: 'Martinez',
      company: 'Quantum Dynamics AI',
      title: 'Director of AI Engineering',
      email: 'smartinez@quantumdynamics.ai',
      phone: '+1-650-555-0122',
      source: 'ORGANIC_SEARCH',
      status: 'QUALIFIED',
      score: 85,
      estimatedValue: 120000,
      notes: 'Interested in enterprise multi-seat expansion with automated workflows.'
    });

    await dealRepo.create(tenant.id, {
      id: 'deal-techflow-ent-01',
      accountId: acc1.id,
      pipelineId: 'pipe-default-01',
      stageId: 'stage-proposal-03',
      ownerUserId: salesRep.id,
      title: 'TechFlow Global CRM Modernization',
      amount: 180000,
      currency: 'USD',
      probability: 75,
      status: 'OPEN',
      expectedCloseDate: '2026-10-31T00:00:00.000Z'
    });

    return { tenantId: tenant.id, adminUserId: adminUser.id };
  }
}
