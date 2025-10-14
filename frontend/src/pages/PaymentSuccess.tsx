import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get('payment_id');
  const preferenceId = searchParams.get('preference_id');

  useEffect(() => {
    // Auto redirect após 5 segundos
    const timer = setTimeout(() => {
      navigate('/subscription');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        {/* Success Animation */}
        <div className="mb-6">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-bounce">
            <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Pagamento Aprovado! 🎉
          </h1>
          <p className="text-gray-600">
            Seu plano foi ativado com sucesso!
          </p>
        </div>

        {/* Details */}
        <div className="bg-green-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-700 mb-2">
            ✅ Pagamento processado
          </p>
          <p className="text-sm text-gray-700 mb-2">
            ✅ Plano ativado
          </p>
          <p className="text-sm text-gray-700">
            ✅ Recursos desbloqueados
          </p>
        </div>

        {/* Payment Info */}
        {paymentId && (
          <div className="text-xs text-gray-500 mb-6">
            ID do Pagamento: {paymentId}
          </div>
        )}

        {/* CTA */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/subscription')}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
          >
            Ver Minha Assinatura
          </button>
          
          <button
            onClick={() => navigate('/swipe')}
            className="w-full px-6 py-3 bg-white border-2 border-blue-500 text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-all"
          >
            Começar a Usar
          </button>
        </div>

        {/* Auto redirect notice */}
        <p className="text-xs text-gray-500 mt-6">
          Redirecionando em 5 segundos...
        </p>
      </div>
    </div>
  );
}

export default PaymentSuccess;

