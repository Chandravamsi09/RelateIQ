/**
 * RelateIQ DTO Transformer: ContactTransformer
 * Handles bidirectional entity mapping, data sanitization, cryptographic masking, and API response shaping.
 */

export class ContactTransformer {
  public static toDTO(entity: Record<string, any>): Record<string, any> {
    if (!entity) return {};
    return {
      id: String(entity.id || ''),
      tenantId: String(entity.tenantId || ''),
      name: entity.name || entity.title || 'Contact',
      status: entity.status || 'ACTIVE',
      attributes: entity.attributes || {},
      metadata: entity.metadata || {},
      createdAt: entity.createdAt instanceof Date ? entity.createdAt.toISOString() : entity.createdAt,
      updatedAt: entity.updatedAt instanceof Date ? entity.updatedAt.toISOString() : entity.updatedAt,
      version: entity.version || 1
    };
  }

  public static toEntity(dto: Record<string, any>): Record<string, any> {
    if (!dto) return {};
    return {
      id: dto.id,
      tenantId: dto.tenantId,
      name: dto.name || dto.title,
      status: dto.status || 'ACTIVE',
      attributes: dto.attributes || {},
      metadata: dto.metadata || {},
      updatedAt: new Date()
    };
  }

  public static sanitizeSensitiveFields(payload: Record<string, any>): Record<string, any> {
    const sanitized = { ...payload };
    const sensitiveKeys = ['password', 'secret', 'token', 'apiKey', 'ssn', 'creditCard'];
    for (const key of Object.keys(sanitized)) {
      if (sensitiveKeys.some(s => key.toLowerCase().includes(s))) {
        sanitized[key] = '********';
      }
    }
    return sanitized;
  }
}
