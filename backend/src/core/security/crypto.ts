/**
 * RelateIQ Enterprise CRM - Cryptographic & Hashing Utilities
 * Secure password hashing, AES-256-GCM symmetric encryption, HMAC signature generator.
 */
import * as crypto from 'crypto';

export class CryptoUtil {
  private static readonly ALGORITHM = 'aes-256-gcm';
  private static readonly IV_LENGTH = 16;
  private static readonly TAG_LENGTH = 16;

  public static hashSha256(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  public static hashHmacSha256(secret: string, data: string): string {
    return crypto.createHmac('sha256', secret).update(data).digest('hex');
  }

  public static generateSecureToken(bytes: number = 32): string {
    return crypto.randomBytes(bytes).toString('hex');
  }

  public static generateUuid(): string {
    return crypto.randomUUID();
  }

  public static encrypt(plainText: string, secretKeyHex: string): { cipherText: string; iv: string; tag: string } {
    const key = Buffer.from(secretKeyHex.padEnd(64, '0').substring(0, 64), 'hex');
    const iv = crypto.randomBytes(this.IV_LENGTH);
    const cipher = crypto.createCipheriv(this.ALGORITHM, key, iv);
    let encrypted = cipher.update(plainText, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const tag = cipher.getAuthTag().toString('hex');
    return {
      cipherText: encrypted,
      iv: iv.toString('hex'),
      tag: tag
    };
  }

  public static decrypt(cipherText: string, ivHex: string, tagHex: string, secretKeyHex: string): string {
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
