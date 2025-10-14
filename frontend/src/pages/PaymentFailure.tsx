import { useNavigate } from 'react-router-dom';

function PaymentFailure() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        {/* Error Icon */}
        <div className="mb-6">
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Ops! Algo deu errado 😕
          </h1>
          <p className="text-gray-600">
            Não foi possível processar seu pagamento
          </p>
        </div>

        {/* Possible Reasons */}
        <div className="bg-red-50 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm font-semibold text-gray-900 mb-2">
            Possíveis motivos:
          </p>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Saldo insuficiente</li>
            <li>• Dados do cartão incorretos</li>
            <li>• Limite de crédito excedido</li>
            <li>• Pagamento rejeitado pelo banco</li>
          </ul>
        </div>

        {/* CTA */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/plans')}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
          >
            🔄 Tentar Novamente
          </button>
          
          <button
            onClick={() => navigate('/subscription')}
            className="w-full px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-all"
          >
            Voltar para Assinatura
          </button>
        </div>

        {/* Help */}
        <div className="mt-6 pt-6 border-t">
          <p className="text-sm text-gray-600 mb-2">
            Precisa de ajuda?
          </p>
          <a
            href="mailto:suporte@dogmatch.com"
            className="text-sm text-blue-600 hover:underline"
          >
            Entre em contato com o suporte
          </a>
        </div>
      </div>
    </div>
  );
}

export default PaymentFailure;

