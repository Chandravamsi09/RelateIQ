const crypto = require('crypto');

class CryptoUtil {
  static ALGORITHM = 'aes-256-gcm';
  static IV_LENGTH = 16;
  static TAG_LENGTH = 16;

  static hashSha256(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  static hashHmacSha256(secret, data) {
    return crypto.createHmac('sha256', secret).update(data).digest('hex');
  }

  static generateSecureToken(bytes = 32) {
    return crypto.randomBytes(bytes).toString('hex');
  }

  static generateUuid() {
    return crypto.randomUUID();
  }

  static encrypt(plainText, secretKeyHex) {
    const key = Buffer.from(secretKeyHex.padEnd(64, '0').substring(0, 64), 'hex');
    const iv = crypto.randomBytes(this.IV_LENGTH);
    const cipher = crypto.createCipheriv(this.ALGORITHM, key, iv);
    let encrypted = cipher.update(plainText, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const tag = cipher.getAuthTag().toString('hex');
    return { cipherText: encrypted, iv: iv.toString('hex'), tag };
  }

  static decrypt(cipherText, ivHex, tagHex, secretKeyHex) {
    const key = Buffer.from(secretKeyHex.padEnd(64, '0').substring(0, 64), 'hex');
    const iv = Buffer.from(ivHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');
    const decipher = crypto.createDecipheriv(this.ALGORITHM, key, iv);
    decipher.setAuthTag(tag);
    let decrypted = decipher.update(cipherText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}

module.exports = { CryptoUtil };
