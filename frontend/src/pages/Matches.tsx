import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { getMatchesByUser } from '../services/swipeService';
import ChatInterface from '../components/ChatInterface';

interface JwtPayload {
  userId: string;
}

function Matches() {
  const [matches, setMatches] = useState<any[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
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
        .catch(() => {
          setMatches([]);
        });
    }
  }, [userId, token]);

  const handleSelectMatch = (match: any) => {
    setSelectedMatch(match);
  };

  const handleBackToList = () => {
    setSelectedMatch(null);
  };

  // Se um match está selecionado, mostrar o chat
  if (selectedMatch) {
    return (
      <div className="min-h-[100vh] bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-7xl mx-auto h-[calc(100vh-2rem)]">
          <ChatInterface
            matches={matches}
            currentUserId={userId}
            token={token!}
            onBack={handleBackToList}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100vh] bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-2">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Seus Matches</h2>
        
        {matches.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <div className="text-6xl mb-4">💔</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">Nenhum match ainda</h3>
            <p className="text-gray-500 mb-4">Continue dando likes para encontrar conexões incríveis!</p>
            <a 
              href="/swipe"
              className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
            >
              🐾 Continuar Swipando
            </a>
          </div>
        ) : (
          <div className="grid gap-4">
            {matches.map((match) => (
              <div 
                key={match.id} 
                onClick={() => handleSelectMatch(match)}
                className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <img 
                      src={match.petA?.photoUrl} 
                      alt={match.petA?.name} 
                      className="w-16 h-16 object-cover rounded-full border-4 border-blue-200 shadow-lg" 
                    />
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">{match.petA?.name}</h3>
                      <p className="text-gray-600 text-sm">{match.petA?.owner?.name}</p>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl mb-2">💕</div>
                    <p className="text-sm text-gray-500">Match!</p>
                  </div>
                  
                  <div className="flex items-center gap-4 flex-1 justify-end">
                    <div className="text-right">
                      <h3 className="font-bold text-gray-800 text-lg">{match.petB?.name}</h3>
                      <p className="text-gray-600 text-sm">{match.petB?.owner?.name}</p>
                    </div>
                    <img 
                      src={match.petB?.photoUrl} 
                      alt={match.petB?.name} 
                      className="w-16 h-16 object-cover rounded-full border-4 border-purple-200 shadow-lg" 
                    />
                  </div>
                </div>
                
                <div className="mt-4 text-center">
                  <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-sm font-semibold">
                    💬 Iniciar Conversa
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Matches;