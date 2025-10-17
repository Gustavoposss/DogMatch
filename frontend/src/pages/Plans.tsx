import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPlans, getMySubscription } from '../services/subscriptionService';
import type { Plan } from '../types/plan';
import { createPlanPayment } from '../services/paymentService';
import PlanBadge from '../components/PlanBadge';
import { toast } from 'react-toastify';

function Plans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<string>('FREE');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    loadPlans();
    loadCurrentPlan();
  }, []);

  const loadPlans = async () => {
    try {
      const data = await getPlans();
      setPlans(data.plans);
    } catch (error) {
      console.error('Erro ao carregar planos:', error);
      toast.error('Erro ao carregar planos');
    }
  };

  const loadCurrentPlan = async () => {
    if (!token) return;
    try {
      const data = await getMySubscription(token);
      setCurrentPlan(data.subscription.planType);
    } catch (error) {
      console.error('Erro ao carregar assinatura:', error);
    }
  };

  const handleChoosePlan = async (planType: string, billingType: 'PIX' | 'BOLETO' = 'PIX') => {
    if (!token) {
      toast.error('Faça login para escolher um plano');
      navigate('/login');
      return;
    }

    if (planType === 'FREE') {
      toast.info('Você já está no plano gratuito!');
      return;
    }

    if (planType === currentPlan) {
      toast.info('Você já está neste plano!');
      return;
    }

    setLoading(true);

    try {
      const payment = await createPlanPayment(planType, token, billingType);
      
      // Salvar dados do pagamento no localStorage para exibir na página de sucesso
      localStorage.setItem('lastPayment', JSON.stringify(payment));
      
      // Redirecionar baseado no tipo de cobrança
      if (payment.pixQrCode) {
        // Se for PIX, redirecionar para página de QR Code
        navigate(`/payment/pix/${payment.paymentId}`);
      } else if (payment.bankSlipUrl) {
        // Se for boleto, abrir em nova aba e redirecionar para página de aguardando
        window.open(payment.bankSlipUrl, '_blank');
        navigate(`/payment/pending/${payment.paymentId}`);
      } else if (payment.invoiceUrl) {
        // Se tiver invoice URL, redirecionar
        window.location.href = payment.invoiceUrl;
      } else {
        toast.success('Pagamento criado! Aguardando confirmação...');
        navigate('/subscription');
      }
    } catch (error: any) {
      console.error('Erro ao criar pagamento:', error);
      toast.error(error.response?.data?.error || 'Erro ao processar pagamento');
      setLoading(false);
    }
  };

  const getPlanIcon = (type: string) => {
    if (type === 'FREE') return '🆓';
    if (type === 'PREMIUM') return '⭐';
    if (type === 'VIP') return '👑';
    return '📦';
  };

  const getPlanColor = (type: string) => {
    if (type === 'FREE') return 'from-gray-400 to-gray-600';
    if (type === 'PREMIUM') return 'from-purple-500 to-purple-700';
    if (type === 'VIP') return 'from-yellow-400 to-yellow-600';
    return 'from-gray-400 to-gray-600';
  };

  return (
    <div className="min-h-screen brand-bg-light py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-brand-primary font-bold text-gray-900 mb-4">
            Escolha o Melhor Plano para Você
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-brand-secondary">
            Mais que encontros, conexões caninas! Encontre o par perfeito para seu pet com recursos incríveis!
          </p>
          {currentPlan && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">Seu plano atual:</p>
              <PlanBadge planType={currentPlan} size="large" />
            </div>
          )}
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => {
            const isCurrentPlan = plan.type === currentPlan;
            const isRecommended = plan.type === 'PREMIUM';

            return (
              <div
                key={plan.type}
                className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 ${
                  isRecommended ? 'ring-4 ring-purple-500' : ''
                }`}
              >
                {/* Recommended Badge */}
                {isRecommended && (
                  <div className="absolute top-0 right-0 bg-purple-500 text-white px-4 py-1 rounded-bl-lg text-sm font-bold">
                    RECOMENDADO 🔥
                  </div>
                )}

                {/* Plan Header */}
                <div className={`bg-gradient-to-r ${getPlanColor(plan.type)} text-white p-6 text-center`}>
                  <div className="text-5xl mb-2">{getPlanIcon(plan.type)}</div>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold">
                    {plan.price === 0 ? (
                      'Grátis'
                    ) : (
                      <>
                        R$ {plan.price.toFixed(2)}
                        <span className="text-sm font-normal">/mês</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="p-6">
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">✓</span>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleChoosePlan(plan.type)}
                    disabled={loading || isCurrentPlan}
                    className={`w-full py-3 px-6 rounded-lg font-bold text-white transition-all duration-200 ${
                      isCurrentPlan
                        ? 'bg-gray-400 cursor-not-allowed'
                        : plan.type === 'FREE'
                        ? 'bg-gray-600 hover:bg-gray-700'
                        : plan.type === 'PREMIUM'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg'
                        : 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 shadow-lg'
                    }`}
                  >
                    {loading ? (
                      'Processando...'
                    ) : isCurrentPlan ? (
                      'Plano Atual ✓'
                    ) : plan.price === 0 ? (
                      'Plano Gratuito'
                    ) : (
                      'Escolher Plano'
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ / Benefits */}
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            💡 Por que fazer upgrade?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-2xl mr-3">🐕</span>
                <div>
                  <h3 className="font-bold text-gray-900">Até 2 Pets</h3>
                  <p className="text-gray-600 text-sm">
                    Cadastre até 2 pets (FREE = 1 pet, Premium/VIP = 2 pets)
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">❤️</span>
                <div>
                  <h3 className="font-bold text-gray-900">Swipes Ilimitados</h3>
                  <p className="text-gray-600 text-sm">
                    Sem limites diários, dê quantos likes quiser
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">🔍</span>
                <div>
                  <h3 className="font-bold text-gray-900">Filtros Avançados</h3>
                  <p className="text-gray-600 text-sm">
                    Filtre por raça específica, faixa etária e localização
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-2xl mr-3">🚀</span>
                <div>
                  <h3 className="font-bold text-gray-900">Boost Mensal</h3>
                  <p className="text-gray-600 text-sm">
                    Apareça em destaque e consiga mais matches
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">👀</span>
                <div>
                  <h3 className="font-bold text-gray-900">Ver Quem Curtiu</h3>
                  <p className="text-gray-600 text-sm">
                    Veja quem deu like no seu pet antes de dar match
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">⭐</span>
                <div>
                  <h3 className="font-bold text-gray-900">Selo Premium/VIP</h3>
                  <p className="text-gray-600 text-sm">
                    Mostre que é um membro especial da comunidade
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="text-center mt-8 text-gray-600">
          <p className="text-sm">
            🔒 Pagamento 100% seguro via Asaas (PIX ou Boleto)
          </p>
          <p className="text-xs mt-2">
            Cancele quando quiser, sem multas ou taxas extras
          </p>
        </div>
      </div>
    </div>
  );
}

export default Plans;

