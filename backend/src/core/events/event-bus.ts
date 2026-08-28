/**
 * RelateIQ Enterprise CRM - In-Process Event Bus & Message Dispatcher
 * Implements decoupled domain event publishing, async queue handlers, and telemetry.
 */

export type EventHandler<T = any> = (event: DomainEvent<T>) => Promise<void> | void;

export interface DomainEvent<T = any> {
  id: string;
  name: string;
  tenantId: string;
  aggregateId: string;
  aggregateType: string;
  timestamp: string;
  version: number;
  payload: T;
  metadata?: {
    actorId?: string;
    correlationId?: string;
    sourceIp?: string;
  };
}

export class EventBus {
  private static instance: EventBus;
  private handlers: Map<string, EventHandler[]> = new Map();
  private globalHandlers: EventHandler[] = [];
  private eventHistory: DomainEvent[] = [];
  private maxHistory: number = 2000;

  private constructor() {}

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public subscribe<T = any>(eventName: string, handler: EventHandler<T>): () => void {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, []);
    }
    this.handlers.get(eventName)!.push(handler);
    return () => {
      const list = this.handlers.get(eventName) || [];
      this.handlers.set(eventName, list.filter(h => h !== handler));
    };
  }

  public subscribeAll(handler: EventHandler): () => void {
    this.globalHandlers.push(handler);
    return () => {
      this.globalHandlers = this.globalHandlers.filter(h => h !== handler);
    };
  }

  public async publish<T = any>(event: DomainEvent<T>): Promise<void> {
    this.eventHistory.push(event);
    if (this.eventHistory.length > this.maxHistory) {
      this.eventHistory.shift();
    }

    const specificHandlers = this.handlers.get(event.name) || [];
    const allHandlers = [...specificHandlers, ...this.globalHandlers];

    const promises = allHandlers.map(async handler => {
      try {
        await handler(event);
      } catch (err) {
        console.error('[EventBus] Error executing handler for ' + event.name + ':', err);
      }
    });

    await Promise.all(promises);
  }

  public getRecentEvents(limit: number = 50): DomainEvent[] {
    return this.eventHistory.slice(-limit);
  }

  public clearHandlers(): void {
    this.handlers.clear();
    this.globalHandlers = [];
  }
}
