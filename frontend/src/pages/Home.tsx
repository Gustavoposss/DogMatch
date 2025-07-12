import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { getUserById } from '../services/authService';

interface JwtPayload {
  userId: string;
  // outros campos se necessário
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

  if (!user) return <div>Carregando...</div>;

  return (
    <div>
      <h2>Bem-vindo, {user.name}!</h2>
      <p>Email: {user.email}</p>
      <p>Cidade: {user.city}</p>
      {/* Adicione mais dados se quiser */}
    </div>
  );
}

export default Home;