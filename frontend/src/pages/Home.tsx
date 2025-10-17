import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { getUserById } from '../services/authService';

interface JwtPayload {
  userId: string;
}

function Home() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode<JwtPayload>(token);
      getUserById(decoded.userId, token)
        .then(setUser)
        .catch(() => setUser(null));
    }
  }, []);

  if (!user) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <span className="text-lg text-gray-500 animate-pulse">Carregando...</span>
    </div>
  );

  return (
    <div className="min-h-[100vh] flex items-center justify-center px-4 brand-bg-light">
      <div className="card-brand p-10 max-w-2xl w-full flex flex-col md:flex-row items-center gap-8">
        {/* Avatar/Ilustração */}
        <div className="flex flex-col items-center justify-center">
          <div className="brand-gradient-primary rounded-full w-32 h-32 flex items-center justify-center shadow-brand-lg mb-4 paw-animation">
            <img src="/par-de-patas-logo.svg" alt="Par de Patas" className="w-20 h-20" />
          </div>
          <span className="brand-text-primary font-brand-secondary font-semibold text-lg">Seu perfil</span>
        </div>
        {/* Informações */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-brand-primary font-extrabold text-gray-900 mb-2">
            Olá, <span className="brand-text-primary">{user.name.split(' ')[0]}</span>!
          </h2>
          <p className="text-gray-700 mb-1 font-brand-secondary">
            <span className="font-semibold">Email:</span> <span className="text-gray-800">{user.email}</span>
          </p>
          <p className="text-gray-700 mb-4 font-brand-secondary">
            <span className="font-semibold">Cidade:</span> <span className="text-gray-800">{user.city}</span>
          </p>
          <div className="brand-bg-light border-2 border-purple-200 rounded-lg p-4 mt-4 shadow-brand">
            <p className="brand-text-primary text-base font-brand-secondary font-medium">
              Seja bem-vindo ao <span className="font-brand-primary font-bold">Par de Patas</span>!<br />
              <span className="slogan-brand text-sm block mt-1">Mais que encontros, conexões caninas</span><br />
              Use o menu acima para cadastrar seu pet, dar swipes e encontrar novos amigos!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;