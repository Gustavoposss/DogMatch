import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/authService';
import { isValidCPF, formatCPF, formatPhone, cleanCPF } from '../utils/validators';

function Register() {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validar CPF
    if (!isValidCPF(cpf)) {
      setError('CPF inválido. Por favor, insira um CPF válido.');
      return;
    }
    
    setIsLoading(true);
    try {
      const cleanedCpf = cleanCPF(cpf);
      const cleanedPhone = phone ? phone.replace(/\D/g, '') : undefined;
      
      const data = await register(name, email, password, city, cleanedCpf, cleanedPhone);
      localStorage.setItem('token', data.token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao cadastrar. Tente outro e-mail.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setCpf(formatted);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
  };

  return (
    <div className="min-h-screen brand-bg-light flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <img src="/par-de-patas-logo.svg" alt="Par de Patas" className="w-16 h-16 paw-animation" />
          </div>
          <h2 className="text-4xl font-brand-primary font-bold text-gray-900 mb-2">
            🐾 Par de Patas
          </h2>
          <p className="text-gray-600 font-brand-secondary slogan-brand">
            Crie sua conta e conecte seu pet
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nome
              </label>
              <input
                id="name"
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                Cidade
              </label>
              <input
                id="city"
                type="text"
                placeholder="Sua cidade"
                value={city}
                onChange={e => setCity(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              />
            </div>
            <div>
              <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-2">
                CPF
              </label>
              <input
                id="cpf"
                type="text"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={handleCpfChange}
                maxLength={14}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Telefone (opcional)
              </label>
              <input
                id="phone"
                type="text"
                placeholder="(00) 00000-0000"
                value={phone}
                onChange={handlePhoneChange}
                maxLength={15}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              />
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            <button 
              type="submit"
              disabled={isLoading}
              className="btn-brand-primary"
            >
              {isLoading ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </form>
          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 font-brand-secondary">
              Já tem uma conta?{' '}
              <Link
                to="/login"
                className="brand-text-primary hover:text-purple-700 font-medium transition-colors duration-200"
              >
                Faça login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;