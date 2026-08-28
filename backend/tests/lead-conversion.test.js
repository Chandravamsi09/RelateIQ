const { LeadRepository, AccountRepository, ContactRepository, DealRepository } = require('../src/database/repositories/crm.repositories');
const { LeadService } = require('../src/modules/leads/lead.service');

test('Lead Conversion: Should atomically convert lead to Account, Contact, and Deal', async () => {
  const leadRepo = new LeadRepository();
  const accountRepo = new AccountRepository();
  const contactRepo = new ContactRepository();
  const dealRepo = new DealRepository();
  const leadService = new LeadService(leadRepo, accountRepo, contactRepo, dealRepo);

  const lead = await leadService.createLead('tenant-test-01', {
    firstName: 'Bruce',
    lastName: 'Wayne',
    company: 'Wayne Enterprises',
    email: 'bruce@waynecorp.com',
    title: 'Chairman',
    estimatedValue: 250000
  });

  const converted = await leadService.convertLead('tenant-test-01', lead.id, {
    dealTitle: 'Wayne Enterprises Enterprise Security'
  });

  assertEqual(converted.lead.status, 'CONVERTED');
  assertEqual(converted.account.name, 'Wayne Enterprises');
  assertEqual(converted.contact.email, 'bruce@waynecorp.com');
  assertEqual(converted.deal.amount, 250000);
});
