import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { getMatchesByUser } from '../services/swipeService';

interface JwtPayload {
  userId: string;
}

function Matches() {
  const [matches, setMatches] = useState<any[]>([]);
  const token = localStorage.getItem('token');
  let userId = '';

  if (token) {
    const decoded = jwtDecode<JwtPayload>(token);
    userId = decoded.userId;
  }

  useEffect(() => {
    if (userId && token) {
      getMatchesByUser(userId, token)
        .then(data => {
          console.log('Matches recebidos:', data);
          setMatches(data);
        })
        .catch((err) => {
          console.error('Erro ao buscar matches:', err);
          setMatches([]);
        });
    }
  }, [userId, token]);

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', background: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}>
      <h2>Seus Matches</h2>
      {matches.length === 0 ? (
        <p>Você ainda não tem matches.</p>
      ) : (
        <ul>
          {matches.map((match) => (
            <li key={match.id} style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
              <img src={match.petA?.photoUrl} alt={match.petA?.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }} />
              <span><strong>{match.petA?.name}</strong></span>
              <span>❤️</span>
              <img src={match.petB?.photoUrl} alt={match.petB?.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }} />
              <span><strong>{match.petB?.name}</strong></span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Matches;