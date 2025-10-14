import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMySubscription, cancelSubscription } from '../services/subscriptionService';
import type { UsageStats, Subscription as SubscriptionType } from '../types/plan';
import { getMyPayments } from '../services/paymentService';
import type { Payment } from '../types/plan';
import PlanBadge from '../components/PlanBadge';
import LimitIndicator from '../components/LimitIndicator';
import { toast } from 'react-toastify';

function Subscription() {
  const [subscription, setSubscription] = useState<SubscriptionType | null>(null);
  const [usage, setUsage] = useState<UsageStats | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    loadSubscriptionData();
    loadPayments();
  }, [token, navigate]);

  const loadSubscriptionData = async () => {
    if (!token) return;
    
    try {
      const data = await getMySubscription(token);
      setSubscription(data.subscription);
      setUsage(data.usage);
    } catch (error) {
      console.error('Erro ao carregar assinatura:', error);
      toast.error('Erro ao carregar dados da assinatura');
    } finally {
      setLoading(false);
    }
  };

  const loadPayments = async () => {
    if (!token) return;
    
    try {
      const data = await getMyPayments(token);
      setPayments(data.payments);
    } catch (error) {
      console.error('Erro ao carregar pagamentos:', error);
    }
  };

  const handleCancelSubscription = async () => {
    if (!token || !subscription) return;

    if (!window.confirm('Tem certeza que deseja cancelar sua assinatura? Você voltará para o plano gratuito.')) {
      return;
    }

    setCanceling(true);

    try {
      await cancelSubscription(token);
      toast.success('Assinatura cancelada com sucesso');
      loadSubscriptionData();
    } catch (error) {
      console.error('Erro ao cancelar assinatura:', error);
      toast.error('Erro ao cancelar assinatura');
    } finally {
      setCanceling(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status: string) => {
    if (status === 'ACTIVE') return 'text-green-600 bg-green-100';
    if (status === 'CANCELED') return 'text-red-600 bg-red-100';
    if (status === 'EXPIRED') return 'text-gray-600 bg-gray-100';
    return 'text-yellow-600 bg-yellow-100';
  };

  const getPaymentStatusColor = (status: string) => {
    if (status === 'COMPLETED') return 'text-green-600 bg-green-100';
    if (status === 'FAILED') return 'text-red-600 bg-red-100';
    if (status === 'PENDING') return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!subscription || !usage) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Nenhuma assinatura encontrada</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Minha Assinatura</h1>

        {/* Plan Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Plano Atual</h2>
              <PlanBadge planType={subscription.planType} size="large" />
            </div>
            <div className="mt-4 md:mt-0">
              <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(subscription.status)}`}>
                {subscription.status === 'ACTIVE' && 'Ativo'}
                {subscription.status === 'CANCELED' && 'Cancelado'}
                {subscription.status === 'EXPIRED' && 'Expirado'}
                {subscription.status === 'PENDING' && 'Pendente'}
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-600">Data de Início</p>
              <p className="text-lg font-semibold text-gray-900">{formatDate(subscription.startDate)}</p>
            </div>
            {subscription.endDate && (
              <div>
                <p className="text-sm text-gray-600">Próxima Renovação</p>
                <p className="text-lg font-semibold text-gray-900">{formatDate(subscription.endDate)}</p>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate('/plans')}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              {subscription.planType === 'FREE' ? '⬆️ Fazer Upgrade' : '🔄 Mudar Plano'}
            </button>
            
            {subscription.planType !== 'FREE' && subscription.status === 'ACTIVE' && (
              <button
                onClick={handleCancelSubscription}
                disabled={canceling}
                className="px-6 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-all disabled:bg-gray-400"
              >
                {canceling ? 'Cancelando...' : '❌ Cancelar Assinatura'}
              </button>
            )}
          </div>
        </div>

        {/* Usage Stats */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Estatísticas de Uso</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Pets */}
            <div>
              <LimitIndicator
                current={usage.pets.current}
                max={usage.pets.max}
                label="🐕 Pets Cadastrados"
                unlimited={usage.pets.unlimited}
              />
            </div>

            {/* Swipes */}
            <div>
              <LimitIndicator
                current={usage.swipes.today}
                max={usage.swipes.max}
                label="❤️ Swipes Hoje"
                unlimited={usage.swipes.unlimited}
              />
            </div>

            {/* Boosts */}
            {usage.boosts.enabled && (
              <div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">🚀 Boosts Disponíveis</span>
                    <span className="text-sm font-bold text-blue-600">
                      {usage.boosts.remaining}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Renova todo mês
                  </p>
                </div>
              </div>
            )}

            {/* Features */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Recursos Ativos</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className={`mr-2 ${usage.features.canSeeWhoLiked ? 'text-green-500' : 'text-gray-400'}`}>
                    {usage.features.canSeeWhoLiked ? '✓' : '✗'}
                  </span>
                  <span className="text-sm text-gray-700">Ver quem curtiu</span>
                </div>
                <div className="flex items-center">
                  <span className={`mr-2 ${usage.features.canUndoSwipe ? 'text-green-500' : 'text-gray-400'}`}>
                    {usage.features.canUndoSwipe ? '✓' : '✗'}
                  </span>
                  <span className="text-sm text-gray-700">Desfazer swipe</span>
                </div>
                <div className="flex items-center">
                  <span className={`mr-2 ${usage.boosts.enabled ? 'text-green-500' : 'text-gray-400'}`}>
                    {usage.boosts.enabled ? '✓' : '✗'}
                  </span>
                  <span className="text-sm text-gray-700">Boost disponível</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment History */}
        {payments.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Histórico de Pagamentos</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Data</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Valor</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Método</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {formatDate(payment.createdAt)}
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                        R$ {payment.amount.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 capitalize">
                        {payment.paymentMethod.replace('_', ' ')}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPaymentStatusColor(payment.status)}`}>
                          {payment.status === 'COMPLETED' && 'Aprovado'}
                          {payment.status === 'PENDING' && 'Pendente'}
                          {payment.status === 'FAILED' && 'Falhou'}
                          {payment.status === 'REFUNDED' && 'Reembolsado'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Subscription;

