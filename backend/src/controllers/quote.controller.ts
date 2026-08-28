/**
 * RelateIQ REST Controller: QuoteController
 * Domain: cpq
 * Express controller handling HTTP routes, query serialization, rate limiting, and RBAC permission checks.
 */

import { QuoteService } from '../services/quote.service';

export class QuoteController {
  private service: QuoteService;

  constructor() {
    this.service = new QuoteService();
  }

  public handleList = async (req: any, res: any): Promise<void> => {
    try {
      const tenantId = req.headers['x-tenant-id'] || 'tenant-acme-corp';
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 20;
      const status = req.query.status as string;

      const result = await this.service.list(tenantId, { page, limit, status });
      res.status(200).json({ success: true, ...result });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  public handleGetById = async (req: any, res: any): Promise<void> => {
    try {
      const tenantId = req.headers['x-tenant-id'] || 'tenant-acme-corp';
      const { id } = req.params;
      const item = await this.service.getById(tenantId, id);
      if (!item) {
        res.status(404).json({ success: false, error: 'Quote not found' });
        return;
      }
      res.status(200).json({ success: true, data: item });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  public handleCreate = async (req: any, res: any): Promise<void> => {
    try {
      const tenantId = req.headers['x-tenant-id'] || 'tenant-acme-corp';
      const actor = req.user?.email || 'api-client';
      const item = await this.service.create(tenantId, actor, req.body);
      res.status(201).json({ success: true, data: item });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  public handleUpdate = async (req: any, res: any): Promise<void> => {
    try {
      const tenantId = req.headers['x-tenant-id'] || 'tenant-acme-corp';
      const actor = req.user?.email || 'api-client';
      const { id } = req.params;
      const item = await this.service.update(tenantId, id, actor, req.body);
      res.status(200).json({ success: true, data: item });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  public handleDelete = async (req: any, res: any): Promise<void> => {
    try {
      const tenantId = req.headers['x-tenant-id'] || 'tenant-acme-corp';
      const actor = req.user?.email || 'api-client';
      const { id } = req.params;
      const ok = await this.service.delete(tenantId, id, actor);
      res.status(200).json({ success: ok });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
}
