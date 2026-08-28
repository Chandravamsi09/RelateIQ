# RelateIQ Enterprise CRM - System Architecture Document

## 1. Executive Summary
RelateIQ is an enterprise-grade multi-tenant Client Relationship Management platform designed for high-velocity sales teams, customer success divisions, and executive leadership.

## 2. Core Architectural Pillars
- **Strict Multi-Tenancy**: Data isolation enforced at database query level and repository boundary.
- **Clean Architecture & Domain-Driven Design (DDD)**: Business domain entities isolated from infrastructure and transport layers.
- **Event-Driven Automation Engine**: In-process and distributed asynchronous event bus dispatching reactive workflows (lead scoring, deal state machines, SLA breach escalations).
- **Comprehensive RBAC Matrix**: 40+ granular permissions mapped to hierarchical enterprise roles.
- **Real-Time Sales Telemetry**: Weighted pipeline forecasting, sales velocity math (`V = (O * A * W) / L`), and customer health scoring.

```
                                  +-------------------------------+
                                  �      Client Applications      �
                                  � (Web App, Mobile, Extensions) �
                                  +-------------------------------+
                                                  �
                                                  ?
                                  +-------------------------------+
                                  �  API Gateway & Auth Guard     �
                                  �  � Rate Limiting              �
                                  �  � Tenant Isolation Guard     �
                                  �  � JWT & RBAC Evaluator       �
                                  +-------------------------------+
                                                  �
                         +------------------------+------------------------+
                         ?                        ?                        ?
               +------------------+     +------------------+     +------------------+
               �  Sales & Deals   �     �  Leads & AI Score�     �  Help Desk & SLA �
               �  Module Service  �     �  Module Service  �     �  Module Service  �
               +------------------+     +------------------+     +------------------+
                         �                        �                        �
                         +------------------------+------------------------+
                                                  �
                                                  ?
                                  +-------------------------------+
                                  �   In-Process Domain Event Bus �
                                  �   (Pub/Sub & Workflow Engine) �
                                  +-------------------------------+
                                                  �
                                                  ?
                                  +-------------------------------+
                                  �      Relational Database      �
                                  �   (PostgreSQL / Prisma ORM)   �
                                  +-------------------------------+
```

## 3. Database Schema Overview
The relational layer incorporates over 30 core entities with foreign keys, composite indexes, soft-delete triggers, and audit log tracking.
