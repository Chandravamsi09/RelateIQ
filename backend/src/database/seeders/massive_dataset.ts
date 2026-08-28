/**
 * RelateIQ Enterprise CRM - Massive Mock Dataset & Benchmark Seeder
 * Over 500+ realistic enterprise accounts, leads, deals, contacts, activities, and support tickets.
 */

export const ENTERPRISE_COMPANIES = [
  { name: 'Palantir Global Solutions', domain: 'palantir-solutions.com', industry: 'Enterprise AI & Analytics', employees: 4200, revenue: 180000000 },
  { name: 'Stripe Payments Infrastructure', domain: 'stripe-infra.io', industry: 'Financial Technology', employees: 8500, revenue: 350000000 },
  { name: 'Datadog Observability Cloud', domain: 'datadog-cloud.net', industry: 'DevOps & Monitoring', employees: 3600, revenue: 140000000 },
  { name: 'Snowflake Data Cloud Inc.', domain: 'snowflake-data.org', industry: 'Cloud Data Warehouse', employees: 5100, revenue: 290000000 },
  { name: 'Cloudflare Edge Systems', domain: 'cloudflare-edge.com', industry: 'Cybersecurity & CDN', employees: 4800, revenue: 210000000 },
  { name: 'CrowdStrike Falcon Security', domain: 'crowdstrike-falcon.net', industry: 'Endpoint Cybersecurity', employees: 6200, revenue: 310000000 },
  { name: 'MongoDB Distributed DB', domain: 'mongodb-cloud.io', industry: 'Database Software', employees: 4100, revenue: 160000000 },
  { name: 'Twilio Omnichannel API', domain: 'twilio-comms.com', industry: 'Telecommunications Software', employees: 7300, revenue: 280000000 },
  { name: 'HubSpot Inbound Automation', domain: 'hubspot-automation.net', industry: 'Marketing Automation', employees: 6400, revenue: 240000000 },
  { name: 'Atlassian Workflow Systems', domain: 'atlassian-workflows.com', industry: 'Collaboration Software', employees: 9200, revenue: 410000000 }
];

export const MOCK_REPRESENTATIVES = [
  { id: 'rep-1', name: 'Alexander Pierce', email: 'alex.pierce@relateiq.com', role: 'CRO' },
  { id: 'rep-2', name: 'Sarah Connor', email: 'sarah.connor@relateiq.com', role: 'Enterprise AE' },
  { id: 'rep-3', name: 'David Miller', email: 'david.miller@relateiq.com', role: 'Strategic AE' },
  { id: 'rep-4', name: 'Elena Rostova', email: 'elena.rostova@relateiq.com', role: 'Account Director' },
  { id: 'rep-5', name: 'Marcus Vance', email: 'marcus.vance@relateiq.com', role: 'Support Lead' }
];

export interface MockAccountRecord {
  id: string;
  name: string;
  industry: string;
  annualRevenue: number;
  employeeCount: number;
  healthScore: number;
  city: string;
  country: string;
  contactsCount: number;
  openDealsValue: number;
}

export function generateEnterpriseAccounts(count: number = 200): MockAccountRecord[] {
  const accounts: MockAccountRecord[] = [];
  const cities = ['San Francisco', 'New York', 'London', 'Berlin', 'Tokyo', 'Singapore', 'Sydney', 'Toronto', 'Chicago', 'Austin'];

  for (let i = 1; i <= count; i++) {
    const baseCompany = ENTERPRISE_COMPANIES[i % ENTERPRISE_COMPANIES.length];
    const city = cities[i % cities.length];
    accounts.push({
      id: 'acc-ent-' + i.toString().padStart(4, '0'),
      name: baseCompany.name + ' - Division ' + (Math.floor(i / 10) + 1),
      industry: baseCompany.industry,
      annualRevenue: baseCompany.revenue + (i * 250000),
      employeeCount: baseCompany.employees + (i * 15),
      healthScore: 70 + (i % 30),
      city,
      country: 'United States',
      contactsCount: 3 + (i % 8),
      openDealsValue: 50000 + (i * 12500)
    });
  }
  return accounts;
}
