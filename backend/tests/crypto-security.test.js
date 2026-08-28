const { CryptoUtil } = require('../src/core/security/crypto');

test('Security & Crypto: Should encrypt and decrypt payload with AES-256-GCM', async () => {
  const secretKey = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
  const plainText = 'Sensitive CRM Customer Financial Data';

  const encrypted = CryptoUtil.encrypt(plainText, secretKey);
  const decrypted = CryptoUtil.decrypt(encrypted.cipherText, encrypted.iv, encrypted.tag, secretKey);

  assertEqual(decrypted, plainText);
});
