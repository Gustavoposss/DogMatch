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
    <div className="min-h-[100vh] flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-2xl w-full flex flex-col md:flex-row items-center gap-8">
        {/* Avatar/Ilustração */}
        <div className="flex flex-col items-center justify-center">
          <div className="bg-gradient-to-br from-blue-400 to-purple-400 rounded-full w-32 h-32 flex items-center justify-center shadow-lg mb-4">
            <span className="text-6xl">🐶</span>
          </div>
          <span className="text-blue-600 font-semibold text-lg">Seu perfil</span>
        </div>
        {/* Informações */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
            Olá, <span className="text-blue-600">{user.name.split(' ')[0]}</span>!
          </h2>
          <p className="text-gray-700 mb-1">
            <span className="font-semibold">Email:</span> <span className="text-gray-800">{user.email}</span>
          </p>
          <p className="text-gray-700 mb-4">
            <span className="font-semibold">Cidade:</span> <span className="text-gray-800">{user.city}</span>
          </p>
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mt-4 shadow-sm">
            <p className="text-blue-700 text-base font-medium">
              Seja bem-vindo ao <span className="font-bold">DogMatch</span>!<br />
              Use o menu acima para cadastrar seu pet, dar swipes e encontrar novos amigos!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;