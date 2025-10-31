/**
 * Logger utilitário para produção/desenvolvimento
 * Remove logs em produção para melhor performance
 */

const isDevelopment = process.env.NODE_ENV !== 'production';
const isDebug = process.env.DEBUG === 'true' || isDevelopment;

class Logger {
  private prefix: string;

  constructor(prefix: string = '') {
    this.prefix = prefix ? `[${prefix}]` : '';
  }

  private formatMessage(...args: any[]): any[] {
    return this.prefix ? [this.prefix, ...args] : args;
  }

  log(...args: any[]): void {
    if (isDebug) {
      console.log(...this.formatMessage(...args));
    }
  }

  info(...args: any[]): void {
    if (isDebug) {
      console.info(...this.formatMessage(...args));
    }
  }

  warn(...args: any[]): void {
    // Warnings sempre são mostrados, mas com menos detalhes em produção
    if (isDevelopment) {
      console.warn(...this.formatMessage(...args));
    } else {
      console.warn(this.prefix || 'WARNING:', args[0]);
    }
  }

  error(...args: any[]): void {
    // Erros sempre são mostrados
    console.error(...this.formatMessage(...args));
  }

  debug(...args: any[]): void {
    // Debug só em desenvolvimento
    if (isDevelopment) {
      console.debug(...this.formatMessage(...args));
    }
  }
}

// Exportar logger padrão
export const logger = new Logger();

// Exportar função para criar loggers customizados
export const createLogger = (prefix: string) => new Logger(prefix);

// Exportar constantes para uso em outras partes do código
export const IS_DEVELOPMENT = isDevelopment;
export const IS_DEBUG = isDebug;

