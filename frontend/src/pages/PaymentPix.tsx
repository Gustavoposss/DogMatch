import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { checkPaymentStatus } from '../services/paymentService';
import { toast } from 'react-toastify';

function PaymentPix() {
  const { paymentId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadPaymentData();
    
    // Verificar status a cada 10 segundos
    const interval = setInterval(() => {
      checkStatus();
    }, 10000);

    return () => clearInterval(interval);
  }, [paymentId]);

  const loadPaymentData = () => {
    const lastPayment = localStorage.getItem('lastPayment');
    if (lastPayment) {
      const data = JSON.parse(lastPayment);
      setPayment(data);
      setLoading(false);
    }
  };

  const checkStatus = async () => {
    if (!token || !paymentId || checking) return;
    
    try {
      setChecking(true);
      const { payment: updatedPayment } = await checkPaymentStatus(paymentId, token);
      
      if (updatedPayment.status === 'COMPLETED') {
        toast.success('Pagamento confirmado! ');
        setTimeout(() => {
          navigate('/subscription');
        }, 2000);
      }
    } catch (error) {
      console.error('Erro ao verificar status:', error);
    } finally {
      setChecking(false);
    }
  };

  const copyPixCode = () => {
    if (payment?.pixQrCode?.payload) {
      navigator.clipboard.writeText(payment.pixQrCode.payload);
      setCopied(true);
      toast.success('Código PIX copiado!');
      setTimeout(() => setCopied(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!payment || !payment.pixQrCode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Pagamento não encontrado</h2>
          <p className="text-gray-600 mb-6">Não foi possível carregar os dados do pagamento.</p>
          <button
            onClick={() => navigate('/plans')}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
          >
            Voltar para Planos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">💳</div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Pagamento via PIX
          </h1>
          <p className="text-gray-600">
            Escaneie o QR Code ou copie o código para pagar
          </p>
        </div>

        {/* QR Code Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6">
            <h2 className="text-2xl font-bold">Valor: R$ {payment.value.toFixed(2)}</h2>
            <p className="text-purple-100">Vencimento: {new Date(payment.dueDate).toLocaleDateString('pt-BR')}</p>
          </div>

          <div className="p-8">
            {/* QR Code Image */}
            <div className="bg-white border-4 border-purple-200 rounded-xl p-4 mb-6">
              <img
                src={`data:image/png;base64,${payment.pixQrCode.encodedImage}`}
                alt="QR Code PIX"
                className="w-full max-w-sm mx-auto"
              />
            </div>

            {/* Copy Code Button */}
            <div className="space-y-4">
              <button
                onClick={copyPixCode}
                className={`w-full py-4 px-6 rounded-lg font-bold text-white transition-all duration-200 ${
                  copied
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                {copied ? '✓ Código Copiado!' : '📋 Copiar Código PIX'}
              </button>

              {/* PIX Code Display */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 mb-2">Código PIX:</p>
                <p className="text-xs font-mono break-all text-gray-800">
                  {payment.pixQrCode.payload}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">📱 Como pagar:</h3>
          <ol className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="bg-purple-100 text-purple-600 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">1</span>
              <span>Abra o app do seu banco</span>
            </li>
            <li className="flex items-start">
              <span className="bg-purple-100 text-purple-600 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">2</span>
              <span>Escolha a opção "Pagar com PIX"</span>
            </li>
            <li className="flex items-start">
              <span className="bg-purple-100 text-purple-600 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">3</span>
              <span>Escaneie o QR Code ou cole o código copiado</span>
            </li>
            <li className="flex items-start">
              <span className="bg-purple-100 text-purple-600 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">4</span>
              <span>Confirme o pagamento</span>
            </li>
            <li className="flex items-start">
              <span className="bg-purple-100 text-purple-600 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">5</span>
              <span>Aguarde a confirmação (geralmente instantâneo)</span>
            </li>
          </ol>
        </div>

        {/* Status Check */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            {checking ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
            ) : (
              <span className="text-2xl mr-2">⏳</span>
            )}
            <p className="text-blue-900 font-semibold">
              {checking ? 'Verificando pagamento...' : 'Aguardando pagamento'}
            </p>
          </div>
          <p className="text-sm text-blue-700">
            Atualizaremos automaticamente quando o pagamento for confirmado
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => checkStatus()}
            disabled={checking}
            className="flex-1 bg-white text-purple-600 border-2 border-purple-600 py-3 px-6 rounded-lg font-bold hover:bg-purple-50 transition disabled:opacity-50"
          >
            {checking ? 'Verificando...' : '🔄 Verificar Agora'}
          </button>
          <button
            onClick={() => navigate('/subscription')}
            className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-bold hover:bg-gray-300 transition"
          >
            Voltar
          </button>
        </div>

        {/* Expiration Info */}
        <div className="text-center mt-6 text-sm text-gray-600">
          <p>⏰ Este QR Code expira em: {new Date(payment.pixQrCode.expirationDate).toLocaleString('pt-BR')}</p>
        </div>
      </div>
    </div>
  );
}

export default PaymentPix;

