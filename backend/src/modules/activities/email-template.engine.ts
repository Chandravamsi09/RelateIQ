export class EmailTemplateEngine {
  public static render(template: string, context: Record<string, any>): string {
    return template.replace(/{{s*([a-zA-Z0-9_.]+)s*}}/g, (_, key) => {
      const parts = key.split('.');
      let current = context;
      for (const part of parts) {
        if (current === undefined || current === null) return '';
        current = current[part];
      }
      return current !== undefined && current !== null ? String(current) : '';
    });
  }
}
