# RelateIQ Master Database Dictionary & Entity Relationship Catalog

## Entity: Tenant
- **Table Name**: `tenants`
- **Partition Key**: `tenant_id` (UUID)
- **Primary Key**: `id` (UUID gen_random_uuid())
- **Description**: Master relational record storing enterprise domain attributes for Tenant.
- **Indexes**:
  - `idx_tenant_tenant_id` on (`tenant_id`)
  - `idx_tenant_created_at` on (`created_at` DESC)
- **Foreign Keys**: Cascading deletion bound to parent Tenant partition.
- **Audit Policy**: Every mutation logs pre-state and post-state diff to `audit_logs`.
- **Concurrency Control**: Optimistic locking enabled via `version` column.

## Entity: User
- **Table Name**: `users`
- **Partition Key**: `tenant_id` (UUID)
- **Primary Key**: `id` (UUID gen_random_uuid())
- **Description**: Master relational record storing enterprise domain attributes for User.
- **Indexes**:
  - `idx_user_tenant_id` on (`tenant_id`)
  - `idx_user_created_at` on (`created_at` DESC)
- **Foreign Keys**: Cascading deletion bound to parent Tenant partition.
- **Audit Policy**: Every mutation logs pre-state and post-state diff to `audit_logs`.
- **Concurrency Control**: Optimistic locking enabled via `version` column.

## Entity: Role
- **Table Name**: `roles`
- **Partition Key**: `tenant_id` (UUID)
- **Primary Key**: `id` (UUID gen_random_uuid())
- **Description**: Master relational record storing enterprise domain attributes for Role.
- **Indexes**:
  - `idx_role_tenant_id` on (`tenant_id`)
  - `idx_role_created_at` on (`created_at` DESC)
- **Foreign Keys**: Cascading deletion bound to parent Tenant partition.
- **Audit Policy**: Every mutation logs pre-state and post-state diff to `audit_logs`.
- **Concurrency Control**: Optimistic locking enabled via `version` column.

## Entity: Permission
- **Table Name**: `permissions`
- **Partition Key**: `tenant_id` (UUID)
- **Primary Key**: `id` (UUID gen_random_uuid())
- **Description**: Master relational record storing enterprise domain attributes for Permission.
- **Indexes**:
  - `idx_permission_tenant_id` on (`tenant_id`)
  - `idx_permission_created_at` on (`created_at` DESC)
- **Foreign Keys**: Cascading deletion bound to parent Tenant partition.
- **Audit Policy**: Every mutation logs pre-state and post-state diff to `audit_logs`.
- **Concurrency Control**: Optimistic locking enabled via `version` column.

## Entity: RolePermission
- **Table Name**: `rolepermissions`
- **Partition Key**: `tenant_id` (UUID)
- **Primary Key**: `id` (UUID gen_random_uuid())
- **Description**: Master relational record storing enterprise domain attributes for RolePermission.
- **Indexes**:
  - `idx_rolepermission_tenant_id` on (`tenant_id`)
  - `idx_rolepermission_created_at` on (`created_at` DESC)
- **Foreign Keys**: Cascading deletion bound to parent Tenant partition.
- **Audit Policy**: Every mutation logs pre-state and post-state diff to `audit_logs`.
- **Concurrency Control**: Optimistic locking enabled via `version` column.

## Entity: UserRole
- **Table Name**: `userroles`
- **Partition Key**: `tenant_id` (UUID)
- **Primary Key**: `id` (UUID gen_random_uuid())
- **Description**: Master relational record storing enterprise domain attributes for UserRole.
- **Indexes**:
  - `idx_userrole_tenant_id` on (`tenant_id`)
  - `idx_userrole_created_at` on (`created_at` DESC)
- **Foreign Keys**: Cascading deletion bound to parent Tenant partition.
- **Audit Policy**: Every mutation logs pre-state and post-state diff to `audit_logs`.
- **Concurrency Control**: Optimistic locking enabled via `version` column.

## Entity: Account
- **Table Name**: `accounts`
- **Partition Key**: `tenant_id` (UUID)
- **Primary Key**: `id` (UUID gen_random_uuid())
- **Description**: Master relational record storing enterprise domain attributes for Account.
- **Indexes**:
  - `idx_account_tenant_id` on (`tenant_id`)
  - `idx_account_created_at` on (`created_at` DESC)
- **Foreign Keys**: Cascading deletion bound to parent Tenant partition.
- **Audit Policy**: Every mutation logs pre-state and post-state diff to `audit_logs`.
- **Concurrency Control**: Optimistic locking enabled via `version` column.

## Entity: Contact
- **Table Name**: `contacts`
- **Partition Key**: `tenant_id` (UUID)
- **Primary Key**: `id` (UUID gen_random_uuid())
- **Description**: Master relational record storing enterprise domain attributes for Contact.
- **Indexes**:
  - `idx_contact_tenant_id` on (`tenant_id`)
  - `idx_contact_created_at` on (`created_at` DESC)
- **Foreign Keys**: Cascading deletion bound to parent Tenant partition.
- **Audit Policy**: Every mutation logs pre-state and post-state diff to `audit_logs`.
- **Concurrency Control**: Optimistic locking enabled via `version` column.

## Entity: Lead
- **Table Name**: `leads`
- **Partition Key**: `tenant_id` (UUID)
- **Primary Key**: `id` (UUID gen_random_uuid())
- **Description**: Master relational record storing enterprise domain attributes for Lead.
- **Indexes**:
  - `idx_lead_tenant_id` on (`tenant_id`)
  - `idx_lead_created_at` on (`created_at` DESC)
- **Foreign Keys**: Cascading deletion bound to parent Tenant partition.
- **Audit Policy**: Every mutation logs pre-state and post-state diff to `audit_logs`.
- **Concurrency Control**: Optimistic locking enabled via `version` column.

## Entity: Pipeline
- **Table Name**: `pipelines`
- **Partition Key**: `tenant_id` (UUID)
- **Primary Key**: `id` (UUID gen_random_uuid())
- **Description**: Master relational record storing enterprise domain attributes for Pipeline.
- **Indexes**:
  - `idx_pipeline_tenant_id` on (`tenant_id`)
  - `idx_pipeline_created_at` on (`created_at` DESC)
- **Foreign Keys**: Cascading deletion bound to parent Tenant partition.
- **Audit Policy**: Every mutation logs pre-state and post-state diff to `audit_logs`.
- **Concurrency Control**: Optimistic locking enabled via `version` column.

## Entity: PipelineStage
- **Table Name**: `pipelinestages`
- **Partition Key**: `tenant_id` (UUID)
- **Primary Key**: `id` (UUID gen_random_uuid())
- **Description**: Master relational record storing enterprise domain attributes for PipelineStage.
- **Indexes**:
  - `idx_pipelinestage_tenant_id` on (`tenant_id`)
  - `idx_pipelinestage_created_at` on (`created_at` DESC)
- **Foreign Keys**: Cascading deletion bound to parent Tenant partition.
- **Audit Policy**: Every mutation logs pre-state and post-state diff to `audit_logs`.
- **Concurrency Control**: Optimistic locking enabled via `version` column.

## Entity: Deal
- **Table Name**: `deals`
- **Partition Key**: `tenant_id` (UUID)
- **Primary Key**: `id` (UUID gen_random_uuid())
- **Description**: Master relational record storing enterprise domain attributes for Deal.
- **Indexes**:
  - `idx_deal_tenant_id` on (`tenant_id`)
  - `idx_deal_created_at` on (`created_at` DESC)
- **Foreign Keys**: Cascading deletion bound to parent Tenant partition.
- **Audit Policy**: Every mutation logs pre-state and post-state diff to `audit_logs`.
- **Concurrency Control**: Optimistic locking enabled via `version` column.

## Entity: DealContact
- **Table Name**: `dealcontacts`
- **Partition Key**: `tenant_id` (UUID)
- **Primary Key**: `id` (UUID gen_random_uuid())
- **Description**: Master relational record storing enterprise domain attributes for DealContact.
- **Indexes**:
  - `idx_dealcontact_tenant_id` on (`tenant_id`)
  - `idx_dealcontact_created_at` on (`created_at` DESC)
- **Foreign Keys**: Cascading deletion bound to parent Tenant partition.
- **Audit Policy**: Every mutation logs pre-state and post-state diff to `audit_logs`.
- **Concurrency Control**: Optimistic locking enabled via `version` column.

## Entity: Activity
- **Table Name**: `activitys`
- **Partition Key**: `tenant_id` (UUID)
- **Primary Key**: `id` (UUID gen_random_uuid())
- **Description**: Master relational record storing enterprise domain attributes for Activity.
- **Indexes**:
  - `idx_activity_tenant_id` on (`tenant_id`)
  - `idx_activity_created_at` on (`created_at` DESC)
- **Foreign Keys**: Cascading deletion bound to parent Tenant partition.
- **Audit Policy**: Every mutation logs pre-state and post-state diff to `audit_logs`.
- **Concurrency Control**: Optimistic locking enabled via `version` column.

## Entity: Task
- **Table Name**: `tasks`
- **Partition Key**: `tenant_id` (UUID)
- **Primary Key**: `id` (UUID gen_random_uuid())
- **Description**: Master relational record storing enterprise domain attributes for Task.
- **Indexes**:
  - `idx_task_tenant_id` on (`tenant_id`)
  - `idx_task_created_at` on (`created_at` DESC)
- **Foreign Keys**: Cascading deletion bound to parent Tenant partition.
- **Audit Policy**: Every mutation logs pre-state and post-state diff to `audit_logs`.
- **Concurrency Control**: Optimistic locking enabled via `version` column.

## Entity: Meeting
- **Table Name**: `meetings`
- **Partition Key**: `tenant_id` (UUID)
- **Primary Key**: `id` (UUID gen_random_uuid())
- **Description**: Master relational record storing enterprise domain attributes for Meeting.
- **Indexes**:
  - `idx_meeting_tenant_id` on (`tenant_id`)
  - `idx_meeting_created_at` on (`created_at` DESC)
- **Foreign Keys**: Cascading deletion bound to parent Tenant partition.
- **Audit Policy**: Every mutation logs pre-state and post-state diff to `audit_logs`.
- **Concurrency Control**: Optimistic locking enabled via `version` column.

## Entity: CallLog
- **Table Name**: `calllogs`
- **Partition Key**: `tenant_id` (UUID)
- **Primary Key**: `id` (UUID gen_random_uuid())
- **Description**: Master relational record storing enterprise domain attributes for CallLog.
- **Indexes**:
  - `idx_calllog_tenant_id` on (`tenant_id`)
  - `idx_calllog_created_at` on (`created_at` DESC)
- **Foreign Keys**: Cascading deletion bound to parent Tenant partition.
- **Audit Policy**: Every mutation logs pre-state and post-state diff to `audit_logs`.
- **Concurrency Control**: Optimistic locking enabled via `version` column.

## Entity: Ticket
- **Table Name**: `tickets`
- **Partition Key**: `tenant_id` (UUID)
- **Primary Key**: `id` (UUID gen_random_uuid())
- **Description**: Master relational record storing enterprise domain attributes for Ticket.
- **Indexes**:
  - `idx_ticket_tenant_id` on (`tenant_id`)
  - `idx_ticket_created_at` on (`created_at` DESC)
- **Foreign Keys**: Cascading deletion bound to parent Tenant partition.
- **Audit Policy**: Every mutation logs pre-state and post-state diff to `audit_logs`.
- **Concurrency Control**: Optimistic locking enabled via `version` column.

## Entity: TicketComment
- **Table Name**: `ticketcomments`
- **Partition Key**: `tenant_id` (UUID)
- **Primary Key**: `id` (UUID gen_random_uuid())
- **Description**: Master relational record storing enterprise domain attributes for TicketComment.
- **Indexes**:
  - `idx_ticketcomment_tenant_id` on (`tenant_id`)
  - `idx_ticketcomment_created_at` on (`created_at` DESC)
- **Foreign Keys**: Cascading deletion bound to parent Tenant partition.
- **Audit Policy**: Every mutation logs pre-state and post-state diff to `audit_logs`.
- **Concurrency Control**: Optimistic locking enabled via `version` column.

## Entity: SLAConfig
- **Table Name**: `slaconfigs`
- **Partition Key**: `tenant_id` (UUID)
- **Primary Key**: `id` (UUID gen_random_uuid())
- **Description**: Master relational record storing enterprise domain attributes for SLAConfig.
- **Indexes**:
  - `idx_slaconfig_tenant_id` on (`tenant_id`)
  - `idx_slaconfig_created_at` on (`created_at` DESC)
- **Foreign Keys**: Cascading deletion bound to parent Tenant partition.
- **Audit Policy**: Every mutation logs pre-state and post-state diff to `audit_logs`.
- **Concurrency Control**: Optimistic locking enabled via `version` column.

## Entity: WorkflowRule
- **Table Name**: `workflowrules`
- **Partition Key**: `tenant_id` (UUID)
- **Primary Key**: `id` (UUID gen_random_uuid())
- **Description**: Master relational record storing enterprise domain attributes for WorkflowRule.
- **Indexes**:
  - `idx_workflowrule_tenant_id` on (`tenant_id`)
  - `idx_workflowrule_created_at` on (`created_at` DESC)
- **Foreign Keys**: Cascading deletion bound to parent Tenant partition.
- **Audit Policy**: Every mutation logs pre-state and post-state diff to `audit_logs`.
- **Concurrency Control**: Optimistic locking enabled via `version` column.

## Entity: WorkflowExecution
- **Table Name**: `workflowexecutions`
- **Partition Key**: `tenant_id` (UUID)
- **Primary Key**: `id` (UUID gen_random_uuid())
- **Description**: Master relational record storing enterprise domain attributes for WorkflowExecution.
- **Indexes**:
  - `idx_workflowexecution_tenant_id` on (`tenant_id`)
  - `idx_workflowexecution_created_at` on (`created_at` DESC)
- **Foreign Keys**: Cascading deletion bound to parent Tenant partition.
- **Audit Policy**: Every mutation logs pre-state and post-state diff to `audit_logs`.
- **Concurrency Control**: Optimistic locking enabled via `version` column.

## Entity: EmailCampaign
- **Table Name**: `emailcampaigns`
- **Partition Key**: `tenant_id` (UUID)
- **Primary Key**: `id` (UUID gen_random_uuid())
- **Description**: Master relational record storing enterprise domain attributes for EmailCampaign.
- **Indexes**:
  - `idx_emailcampaign_tenant_id` on (`tenant_id`)
  - `idx_emailcampaign_created_at` on (`created_at` DESC)
- **Foreign Keys**: Cascading deletion bound to parent Tenant partition.
- **Audit Policy**: Every mutation logs pre-state and post-state diff to `audit_logs`.
- **Concurrency Control**: Optimistic locking enabled via `version` column.

## Entity: CampaignRecipient
- **Table Name**: `campaignrecipients`
- **Partition Key**: `tenant_id` (UUID)
- **Primary Key**: `id` (UUID gen_random_uuid())
- **Description**: Master relational record storing enterprise domain attributes for CampaignRecipient.
- **Indexes**:
  - `idx_campaignrecipient_tenant_id` on (`tenant_id`)
  - `idx_campaignrecipient_created_at` on (`created_at` DESC)
- **Foreign Keys**: Cascading deletion bound to parent Tenant partition.
- **Audit Policy**: Every mutation logs pre-state and post-state diff to `audit_logs`.
- **Concurrency Control**: Optimistic locking enabled via `version` column.

## Entity: Invoice
- **Table Name**: `invoices`
- **Partition Key**: `tenant_id` (UUID)
- **Primary Key**: `id` (UUID gen_random_uuid())
- **Description**: Master relational record storing enterprise domain attributes for Invoice.
- **Indexes**:
  - `idx_invoice_tenant_id` on (`tenant_id`)
  - `idx_invoice_created_at` on (`created_at` DESC)
- **Foreign Keys**: Cascading deletion bound to parent Tenant partition.
- **Audit Policy**: Every mutation logs pre-state and post-state diff to `audit_logs`.
- **Concurrency Control**: Optimistic locking enabled via `version` column.

## Entity: InvoiceLineItem
- **Table Name**: `invoicelineitems`
- **Partition Key**: `tenant_id` (UUID)
- **Primary Key**: `id` (UUID gen_random_uuid())
- **Description**: Master relational record storing enterprise domain attributes for InvoiceLineItem.
- **Indexes**:
  - `idx_invoicelineitem_tenant_id` on (`tenant_id`)
  - `idx_invoicelineitem_created_at` on (`created_at` DESC)
- **Foreign Keys**: Cascading deletion bound to parent Tenant partition.
- **Audit Policy**: Every mutation logs pre-state and post-state diff to `audit_logs`.
- **Concurrency Control**: Optimistic locking enabled via `version` column.

## Entity: Contract
- **Table Name**: `contracts`
- **Partition Key**: `tenant_id` (UUID)
- **Primary Key**: `id` (UUID gen_random_uuid())
- **Description**: Master relational record storing enterprise domain attributes for Contract.
- **Indexes**:
  - `idx_contract_tenant_id` on (`tenant_id`)
  - `idx_contract_created_at` on (`created_at` DESC)
- **Foreign Keys**: Cascading deletion bound to parent Tenant partition.
- **Audit Policy**: Every mutation logs pre-state and post-state diff to `audit_logs`.
- **Concurrency Control**: Optimistic locking enabled via `version` column.

## Entity: ContractSigner
- **Table Name**: `contractsigners`
- **Partition Key**: `tenant_id` (UUID)
- **Primary Key**: `id` (UUID gen_random_uuid())
- **Description**: Master relational record storing enterprise domain attributes for ContractSigner.
- **Indexes**:
  - `idx_contractsigner_tenant_id` on (`tenant_id`)
  - `idx_contractsigner_created_at` on (`created_at` DESC)
- **Foreign Keys**: Cascading deletion bound to parent Tenant partition.
- **Audit Policy**: Every mutation logs pre-state and post-state diff to `audit_logs`.
- **Concurrency Control**: Optimistic locking enabled via `version` column.

## Entity: AuditLog
- **Table Name**: `auditlogs`
- **Partition Key**: `tenant_id` (UUID)
- **Primary Key**: `id` (UUID gen_random_uuid())
- **Description**: Master relational record storing enterprise domain attributes for AuditLog.
- **Indexes**:
  - `idx_auditlog_tenant_id` on (`tenant_id`)
  - `idx_auditlog_created_at` on (`created_at` DESC)
- **Foreign Keys**: Cascading deletion bound to parent Tenant partition.
- **Audit Policy**: Every mutation logs pre-state and post-state diff to `audit_logs`.
- **Concurrency Control**: Optimistic locking enabled via `version` column.

## Entity: WebhookEndpoint
- **Table Name**: `webhookendpoints`
- **Partition Key**: `tenant_id` (UUID)
- **Primary Key**: `id` (UUID gen_random_uuid())
- **Description**: Master relational record storing enterprise domain attributes for WebhookEndpoint.
- **Indexes**:
  - `idx_webhookendpoint_tenant_id` on (`tenant_id`)
  - `idx_webhookendpoint_created_at` on (`created_at` DESC)
- **Foreign Keys**: Cascading deletion bound to parent Tenant partition.
- **Audit Policy**: Every mutation logs pre-state and post-state diff to `audit_logs`.
- **Concurrency Control**: Optimistic locking enabled via `version` column.

## Entity: WebhookDelivery
- **Table Name**: `webhookdeliverys`
- **Partition Key**: `tenant_id` (UUID)
- **Primary Key**: `id` (UUID gen_random_uuid())
- **Description**: Master relational record storing enterprise domain attributes for WebhookDelivery.
- **Indexes**:
  - `idx_webhookdelivery_tenant_id` on (`tenant_id`)
  - `idx_webhookdelivery_created_at` on (`created_at` DESC)
- **Foreign Keys**: Cascading deletion bound to parent Tenant partition.
- **Audit Policy**: Every mutation logs pre-state and post-state diff to `audit_logs`.
- **Concurrency Control**: Optimistic locking enabled via `version` column.

## Entity: Notification
- **Table Name**: `notifications`
- **Partition Key**: `tenant_id` (UUID)
- **Primary Key**: `id` (UUID gen_random_uuid())
- **Description**: Master relational record storing enterprise domain attributes for Notification.
- **Indexes**:
  - `idx_notification_tenant_id` on (`tenant_id`)
  - `idx_notification_created_at` on (`created_at` DESC)
- **Foreign Keys**: Cascading deletion bound to parent Tenant partition.
- **Audit Policy**: Every mutation logs pre-state and post-state diff to `audit_logs`.
- **Concurrency Control**: Optimistic locking enabled via `version` column.

## Entity: UserPreference
- **Table Name**: `userpreferences`
- **Partition Key**: `tenant_id` (UUID)
- **Primary Key**: `id` (UUID gen_random_uuid())
- **Description**: Master relational record storing enterprise domain attributes for UserPreference.
- **Indexes**:
  - `idx_userpreference_tenant_id` on (`tenant_id`)
  - `idx_userpreference_created_at` on (`created_at` DESC)
- **Foreign Keys**: Cascading deletion bound to parent Tenant partition.
- **Audit Policy**: Every mutation logs pre-state and post-state diff to `audit_logs`.
- **Concurrency Control**: Optimistic locking enabled via `version` column.

## Entity: CustomFieldDefinition
- **Table Name**: `customfielddefinitions`
- **Partition Key**: `tenant_id` (UUID)
- **Primary Key**: `id` (UUID gen_random_uuid())
- **Description**: Master relational record storing enterprise domain attributes for CustomFieldDefinition.
- **Indexes**:
  - `idx_customfielddefinition_tenant_id` on (`tenant_id`)
  - `idx_customfielddefinition_created_at` on (`created_at` DESC)
- **Foreign Keys**: Cascading deletion bound to parent Tenant partition.
- **Audit Policy**: Every mutation logs pre-state and post-state diff to `audit_logs`.
- **Concurrency Control**: Optimistic locking enabled via `version` column.
