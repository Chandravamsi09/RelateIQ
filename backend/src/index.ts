import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { config } from './core/config/environment';
import { Logger } from './core/logger/logger';
import { TenantRepository, UserRepository, AccountRepository, ContactRepository, LeadRepository, DealRepository, ActivityRepository, TicketRepository, WorkflowRepository } from './database/repositories/crm.repositories';
import { DemoSeeder } from './database/seeders/demo-seeder';
import { AuthService } from './modules/auth/auth.service';
import { AccountService } from './modules/accounts/account.service';
import { ContactService } from './modules/contacts/contact.service';
import { LeadService } from './modules/leads/lead.service';
import { DealService } from './modules/deals/deal.service';
import { ActivityService } from './modules/activities/activity.service';
import { TicketService } from './modules/support/ticket.service';
import { AnalyticsService } from './modules/analytics/analytics.service';
import { WorkflowEngine } from './modules/workflows/workflow.engine';
import { createApiRouter } from './api/routes/api.routes';

async function bootstrap() {
  const app = express();
  app.use(helmet());
  app.use(cors({ origin: '*' }));
  app.use(express.json());

  // Repositories
  const tenantRepo = new TenantRepository();
  const userRepo = new UserRepository();
  const accountRepo = new AccountRepository();
  const contactRepo = new ContactRepository();
  const leadRepo = new LeadRepository();
  const dealRepo = new DealRepository();
  const activityRepo = new ActivityRepository();
  const ticketRepo = new TicketRepository();
  const workflowRepo = new WorkflowRepository();

  // Initialize Seeder
  await DemoSeeder.seedAll(
    tenantRepo, userRepo, accountRepo, contactRepo,
    leadRepo, dealRepo, activityRepo, ticketRepo, workflowRepo
  );

  // Services
  const authService = new AuthService(userRepo, tenantRepo);
  const accountService = new AccountService(accountRepo, contactRepo);
  const contactService = new ContactService(contactRepo, accountRepo);
  const leadService = new LeadService(leadRepo, accountRepo, contactRepo, dealRepo);
  const dealService = new DealService(dealRepo);
  const activityService = new ActivityService(activityRepo);
  const ticketService = new TicketService(ticketRepo);
  const analyticsService = new AnalyticsService(dealRepo, leadRepo, accountRepo, ticketRepo);
  const workflowEngine = new WorkflowEngine(workflowRepo);

  // Mount API Router
  const apiRouter = createApiRouter({
    authService, accountService, contactService, leadService,
    dealService, activityService, ticketService, analyticsService
  });

  app.use('/api/v1', apiRouter);

  app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString(), service: 'RelateIQ Enterprise CRM API' });
  });

  const httpServer = createServer(app);
  httpServer.listen(config.port, () => {
    Logger.info('RelateIQ Enterprise Server running on port ' + config.port);
  });
}

bootstrap().catch(err => {
  Logger.error('Failed to bootstrap RelateIQ Server', undefined, err);
});
