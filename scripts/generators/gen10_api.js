const { save } = require('./writer');

console.log('Generating Phase 10: Full REST API Controllers & WebSocket Gateway...');

// 1. Api Router & Controllers
save('backend/src/api/routes/api.routes.ts', `
import { Router, Request, Response, NextFunction } from 'express';
import { AuthService } from '../../modules/auth/auth.service';
import { AccountService } from '../../modules/accounts/account.service';
import { ContactService } from '../../modules/contacts/contact.service';
import { LeadService } from '../../modules/leads/lead.service';
import { DealService } from '../../modules/deals/deal.service';
import { ActivityService } from '../../modules/activities/activity.service';
import { TicketService } from '../../modules/support/ticket.service';
import { AnalyticsService } from '../../modules/analytics/analytics.service';
import { AppError } from '../../core/errors/app-error';

export function createApiRouter(services: {
  authService: AuthService;
  accountService: AccountService;
  contactService: ContactService;
  leadService: LeadService;
  dealService: DealService;
  activityService: ActivityService;
  ticketService: TicketService;
  analyticsService: AnalyticsService;
}): Router {
  const router = Router();

  // Auth Middleware Helper
  const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Token required' } });
      }
      const user = await services.authService.validateToken(authHeader);
      (req as any).user = user;
      next();
    } catch (err: any) {
      res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: err.message } });
    }
  };

  // Auth Routes
  router.post('/auth/register', async (req, res) => {
    try {
      const result = await services.authService.registerTenantAndAdmin(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err: any) {
      res.status(err.statusCode || 500).json({ success: false, error: { message: err.message } });
    }
  });

  router.post('/auth/login', async (req, res) => {
    try {
      const { tenantId, email, password } = req.body;
      const result = await services.authService.login(tenantId, email, password);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(err.statusCode || 500).json({ success: false, error: { message: err.message } });
    }
  });

  // Accounts Routes
  router.get('/accounts', requireAuth, async (req, res) => {
    const user = (req as any).user;
    const result = await services.accountService.listAccounts(user.tenantId, req.query);
    res.json({ success: true, ...result });
  });

  router.post('/accounts', requireAuth, async (req, res) => {
    const user = (req as any).user;
    const result = await services.accountService.createAccount(user.tenantId, req.body);
    res.status(201).json({ success: true, data: result });
  });

  router.get('/accounts/:id/360', requireAuth, async (req, res) => {
    const user = (req as any).user;
    const result = await services.accountService.getAccount360(user.tenantId, req.params.id);
    res.json({ success: true, data: result });
  });

  // Leads Routes
  router.get('/leads', requireAuth, async (req, res) => {
    const user = (req as any).user;
    const result = await services.leadService.listLeads(user.tenantId, req.query);
    res.json({ success: true, ...result });
  });

  router.post('/leads', requireAuth, async (req, res) => {
    const user = (req as any).user;
    const result = await services.leadService.createLead(user.tenantId, req.body);
    res.status(201).json({ success: true, data: result });
  });

  router.post('/leads/:id/convert', requireAuth, async (req, res) => {
    const user = (req as any).user;
    const result = await services.leadService.convertLead(user.tenantId, req.params.id, req.body);
    res.json({ success: true, data: result });
  });

  // Deals Routes
  router.get('/deals', requireAuth, async (req, res) => {
    const user = (req as any).user;
    const result = await services.dealService.listDeals(user.tenantId, req.query);
    res.json({ success: true, ...result });
  });

  router.post('/deals', requireAuth, async (req, res) => {
    const user = (req as any).user;
    const result = await services.dealService.createDeal(user.tenantId, req.body);
    res.status(201).json({ success: true, data: result });
  });

  router.patch('/deals/:id/stage', requireAuth, async (req, res) => {
    const user = (req as any).user;
    const { stageId, probability } = req.body;
    const result = await services.dealService.updateStage(user.tenantId, req.params.id, stageId, probability);
    res.json({ success: true, data: result });
  });

  // Activities Routes
  router.get('/activities', requireAuth, async (req, res) => {
    const user = (req as any).user;
    const result = await services.activityService.listActivities(user.tenantId, req.query);
    res.json({ success: true, ...result });
  });

  router.post('/activities', requireAuth, async (req, res) => {
    const user = (req as any).user;
    const result = await services.activityService.createActivity(user.tenantId, req.body);
    res.status(201).json({ success: true, data: result });
  });

  // Tickets Routes
  router.get('/tickets', requireAuth, async (req, res) => {
    const user = (req as any).user;
    const result = await services.ticketService.listTickets(user.tenantId, req.query);
    res.json({ success: true, ...result });
  });

  router.post('/tickets', requireAuth, async (req, res) => {
    const user = (req as any).user;
    const result = await services.ticketService.createTicket(user.tenantId, req.body);
    res.status(201).json({ success: true, data: result });
  });

  // Analytics Routes
  router.get('/analytics/overview', requireAuth, async (req, res) => {
    const user = (req as any).user;
    const result = await services.analyticsService.getExecutiveOverview(user.tenantId);
    res.json({ success: true, data: result });
  });

  return router;
}
`);

// 2. Main Server Entrypoint
save('backend/src/index.ts', `
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
`);

console.log('Phase 10 generated successfully!');
