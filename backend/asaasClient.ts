import axios from 'axios';

/**
 * Cliente HTTP para API do Asaas
 * Documentação: https://docs.asaas.com/
 */
class AsaasClient {
  private client: any;
  private apiKey: string;
  private baseURL: string;

  constructor() {
    this.apiKey = process.env.ASAAS_API_KEY || '';
    
    // Definir URL base conforme ambiente
    const environment = process.env.ASAAS_ENVIRONMENT || 'sandbox';
    this.baseURL = environment === 'production' 
      ? 'https://api.asaas.com/v3'
      : 'https://sandbox.asaas.com/api/v3';

    if (!this.apiKey) {
      console.warn('⚠️  ASAAS_API_KEY não configurada no .env');
    }

    // Configurar cliente axios
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
        'access_token': this.apiKey
      },
      timeout: 30000 // 30 segundos
    });

    // Interceptor para log de requisições (desenvolvimento)
    this.client.interceptors.request.use(
      (config: any) => {
        console.log(`🔵 Asaas Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error: any) => {
        console.error('❌ Asaas Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Interceptor para log de respostas
    this.client.interceptors.response.use(
      (response: any) => {
        console.log(`✅ Asaas Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error: any) => {
        if (error.response) {
          console.error(`❌ Asaas Error ${error.response.status}:`, error.response.data);
        } else {
          console.error('❌ Asaas Network Error:', error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  // ==================== CLIENTES ====================

  /**
   * Criar novo cliente no Asaas
   */
  async createCustomer(data: {
    name: string;
    email: string;
    cpfCnpj?: string;
    phone?: string;
    mobilePhone?: string;
    address?: string;
    addressNumber?: string;
    province?: string;
    postalCode?: string;
  }) {
    const response = await this.client.post('/customers', data);
    return response.data;
  }

  /**
   * Buscar cliente por ID
   */
  async getCustomer(customerId: string) {
    const response = await this.client.get(`/customers/${customerId}`);
    return response.data;
  }

  /**
   * Buscar cliente por email
   */
  async getCustomerByEmail(email: string) {
    const response = await this.client.get('/customers', {
      params: { email }
    });
    return response.data;
  }

  /**
   * Atualizar cliente
   */
  async updateCustomer(customerId: string, data: any) {
    const response = await this.client.put(`/customers/${customerId}`, data);
    return response.data;
  }

  // ==================== COBRANÇAS/PAGAMENTOS ====================

  /**
   * Criar cobrança única
   */
  async createPayment(data: {
    customer: string; // ID do cliente
    billingType: 'BOLETO' | 'CREDIT_CARD' | 'PIX' | 'UNDEFINED';
    value: number;
    dueDate: string; // formato: YYYY-MM-DD
    description?: string;
    externalReference?: string;
    installmentCount?: number;
    installmentValue?: number;
    discount?: {
      value?: number;
      dueDateLimitDays?: number;
    };
    interest?: {
      value?: number;
    };
    fine?: {
      value?: number;
    };
  }) {
    const response = await this.client.post('/payments', data);
    return response.data;
  }

  /**
   * Buscar cobrança por ID
   */
  async getPayment(paymentId: string) {
    const response = await this.client.get(`/payments/${paymentId}`);
    return response.data;
  }

  /**
   * Atualizar cobrança
   */
  async updatePayment(paymentId: string, data: any) {
    const response = await this.client.put(`/payments/${paymentId}`, data);
    return response.data;
  }

  /**
   * Deletar cobrança
   */
  async deletePayment(paymentId: string) {
    const response = await this.client.delete(`/payments/${paymentId}`);
    return response.data;
  }

  /**
   * Obter QR Code do PIX
   */
  async getPixQrCode(paymentId: string) {
    const response = await this.client.get(`/payments/${paymentId}/pixQrCode`);
    return response.data;
  }

  // ==================== ASSINATURAS (RECORRÊNCIA) ====================

  /**
   * Criar assinatura recorrente
   */
  async createSubscription(data: {
    customer: string; // ID do cliente
    billingType: 'BOLETO' | 'CREDIT_CARD' | 'PIX';
    value: number;
    nextDueDate: string; // formato: YYYY-MM-DD
    cycle: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'SEMIANNUALLY' | 'YEARLY';
    description?: string;
    externalReference?: string;
    endDate?: string;
    maxPayments?: number;
    discount?: {
      value?: number;
      dueDateLimitDays?: number;
    };
  }) {
    const response = await this.client.post('/subscriptions', data);
    return response.data;
  }

  /**
   * Buscar assinatura por ID
   */
  async getSubscription(subscriptionId: string) {
    const response = await this.client.get(`/subscriptions/${subscriptionId}`);
    return response.data;
  }

  /**
   * Atualizar assinatura
   */
  async updateSubscription(subscriptionId: string, data: any) {
    const response = await this.client.put(`/subscriptions/${subscriptionId}`, data);
    return response.data;
  }

  /**
   * Cancelar assinatura
   */
  async deleteSubscription(subscriptionId: string) {
    const response = await this.client.delete(`/subscriptions/${subscriptionId}`);
    return response.data;
  }

  /**
   * Listar cobranças de uma assinatura
   */
  async getSubscriptionPayments(subscriptionId: string) {
    const response = await this.client.get(`/subscriptions/${subscriptionId}/payments`);
    return response.data;
  }

  // ==================== WEBHOOKS ====================

  /**
   * Listar webhooks configurados
   */
  async listWebhooks() {
    const response = await this.client.get('/webhooks');
    return response.data;
  }

  /**
   * Criar webhook
   */
  async createWebhook(data: {
    name: string;
    url: string;
    email: string;
    apiVersion: number;
    enabled: boolean;
    interrupted: boolean;
    authToken?: string;
    events: string[];
  }) {
    const response = await this.client.post('/webhooks', data);
    return response.data;
  }

  // ==================== UTILITÁRIOS ====================

  /**
   * Verificar se a API está funcionando
   */
  async healthCheck() {
    try {
      const response = await this.client.get('/customers', { params: { limit: 1 } });
      return {
        status: 'ok',
        environment: process.env.ASAAS_ENVIRONMENT || 'sandbox',
        baseURL: this.baseURL,
        hasApiKey: !!this.apiKey
      };
    } catch (error: any) {
      return {
        status: 'error',
        environment: process.env.ASAAS_ENVIRONMENT || 'sandbox',
        baseURL: this.baseURL,
        hasApiKey: !!this.apiKey,
        error: error.message
      };
    }
  }
}

// Exportar instância singleton
export const asaasClient = new AsaasClient();
export default asaasClient;

