const { AccountRepository, ContactRepository } = require('../src/database/repositories/crm.repositories');
const { AccountService } = require('../src/modules/accounts/account.service');

test('Account Health: Should compute holistic health score from revenue & contacts', async () => {
  const accRepo = new AccountRepository();
  const conRepo = new ContactRepository();
  const accService = new AccountService(accRepo, conRepo);

  const acc = await accService.createAccount('tenant-test-01', {
    name: 'Cyberdyne Systems',
    annualRevenue: 5000000,
    website: 'https://cyberdyne.com',
    phone: '+1-555-0100'
  });

  await conRepo.create('tenant-test-01', {
    accountId: acc.id,
    firstName: 'Miles',
    lastName: 'Dyson',
    email: 'miles@cyberdyne.com',
    isPrimary: true
  });

  const score = await accService.calculateHealthScore('tenant-test-01', acc.id);
  assert(score >= 80, 'Healthy enterprise account score should be >= 80');
});
