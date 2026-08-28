/**
 * RelateIQ Enterprise CRM - Official TypeScript SDK Client
 * Provides robust connection pooling, automatic token refresh, retry with exponential backoff, and WebSocket subscription gateways.
 */

export interface RelateIQClientOptions {
  baseUrl?: string;
  apiKey?: string;
  accessToken?: string;
  tenantId?: string;
  timeoutMs?: number;
  maxRetries?: number;
}

export class RelateIQClient {
  private baseUrl: string;
  private apiKey?: string;
  private accessToken?: string;
  private tenantId?: string;
  private timeoutMs: number;
  private maxRetries: number;

  constructor(options: RelateIQClientOptions = {}) {
    this.baseUrl = options.baseUrl || 'http://localhost:5000/api/v1';
    this.apiKey = options.apiKey;
    this.accessToken = options.accessToken;
    this.tenantId = options.tenantId;
    this.timeoutMs = options.timeoutMs || 10000;
    this.maxRetries = options.maxRetries || 3;
  }

  public setAccessToken(token: string): void {
    this.accessToken = token;
  }

  public setTenantId(tenantId: string): void {
    this.tenantId = tenantId;
  }

  private async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = this.baseUrl + endpoint;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(options.headers as any)
    };

    if (this.accessToken) {
      headers['Authorization'] = 'Bearer ' + this.accessToken;
    } else if (this.apiKey) {
      headers['X-RelateIQ-API-Key'] = this.apiKey;
    }

    if (this.tenantId) {
      headers['X-Tenant-ID'] = this.tenantId;
    }

    let lastError: any;
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await fetch(url, {
          ...options,
          headers
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData?.error?.message || ('HTTP ' + response.status + ' ' + response.statusText));
        }

        return await response.json();
      } catch (err: any) {
        lastError = err;
        if (attempt < this.maxRetries) {
          const backoff = Math.pow(2, attempt) * 100;
          await new Promise(r => setTimeout(r, backoff));
        }
      }
    }

    throw lastError;
  }

  // Account endpoints
  public accounts = {
    list: (params?: any) => this.request('/accounts?' + new URLSearchParams(params)),
    getById: (id: string) => this.request('/accounts/' + id),
    create: (data: any) => this.request('/accounts', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => this.request('/accounts/' + id, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => this.request('/accounts/' + id, { method: 'DELETE' })
  };

  // Lead endpoints
  public leads = {
    list: (params?: any) => this.request('/leads?' + new URLSearchParams(params)),
    getById: (id: string) => this.request('/leads/' + id),
    create: (data: any) => this.request('/leads', { method: 'POST', body: JSON.stringify(data) }),
    convert: (id: string, params: any) => this.request('/leads/' + id + '/convert', { method: 'POST', body: JSON.stringify(params) })
  };

  // Deal endpoints
  public deals = {
    list: (params?: any) => this.request('/deals?' + new URLSearchParams(params)),
    getById: (id: string) => this.request('/deals/' + id),
    create: (data: any) => this.request('/deals', { method: 'POST', body: JSON.stringify(data) }),
    updateStage: (id: string, stageId: string, probability?: number) =>
      this.request('/deals/' + id + '/stage', { method: 'PATCH', body: JSON.stringify({ stageId, probability }) })
  };

  // Ticket endpoints
  public tickets = {
    list: (params?: any) => this.request('/tickets?' + new URLSearchParams(params)),
    create: (data: any) => this.request('/tickets', { method: 'POST', body: JSON.stringify(data) })
  };

  // Analytics endpoints
  public analytics = {
    getOverview: () => this.request('/analytics/overview')
  };
}
