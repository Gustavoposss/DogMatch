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
          setMatches(data);
        })
        .catch((err) => {
          setMatches([]);
        });
    }
  }, [userId, token]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-2">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Seus Matches</h2>
        {matches.length === 0 ? (
          <p className="text-gray-500 text-center">Você ainda não tem matches.</p>
        ) : (
          <ul className="space-y-6">
            {matches.map((match) => (
              <li key={match.id} className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-blue-50 rounded-xl p-4 shadow-md">
                <div className="flex items-center gap-4 flex-1">
                  <img src={match.petA?.photoUrl} alt={match.petA?.name} className="w-16 h-16 object-cover rounded-lg border-2 border-blue-200 shadow" />
                  <span className="font-bold text-gray-800 text-lg">{match.petA?.name}</span>
                </div>
                <span className="text-2xl">❤️</span>
                <div className="flex items-center gap-4 flex-1 justify-end">
                  <img src={match.petB?.photoUrl} alt={match.petB?.name} className="w-16 h-16 object-cover rounded-lg border-2 border-purple-200 shadow" />
                  <span className="font-bold text-gray-800 text-lg">{match.petB?.name}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Matches;