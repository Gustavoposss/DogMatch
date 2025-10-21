interface MatchPopupProps {
  isOpen: boolean;
  onClose: () => void;
  match: {
    petA: {
      name: string;
      photoUrl: string;
      owner: { name: string };
    };
    petB: {
      name: string;
      photoUrl: string;
      owner: { name: string };
    };
  };
  onStartChat: () => void;
}

export default function MatchPopup({ isOpen, onClose, match, onStartChat }: MatchPopupProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-bounce-in">
        {/* Header com confetes */}
        <div className="relative bg-gradient-to-r from-pink-400 to-purple-500 p-6 text-center">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-2 left-4 text-yellow-300 text-2xl animate-bounce">🎉</div>
            <div className="absolute top-4 right-6 text-pink-300 text-xl animate-bounce delay-100">✨</div>
            <div className="absolute top-6 left-8 text-green-300 text-lg animate-bounce delay-200">🎊</div>
            <div className="absolute top-3 right-8 text-blue-300 text-xl animate-bounce delay-300">💫</div>
            <div className="absolute top-5 left-6 text-yellow-300 text-lg animate-bounce delay-500">🌟</div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2 relative z-10">
            🎉 É UM MATCH! 🎉
          </h2>
          <p className="text-white/90 text-lg relative z-10">
            Vocês se curtiram!
          </p>
        </div>

        {/* Conteúdo do match */}
        <div className="p-6">
          <div className="flex items-center justify-center gap-4 mb-6">
            {/* Pet A */}
            <div className="text-center">
              <img 
                src={match.petA.photoUrl} 
                alt={match.petA.name}
                className="w-20 h-20 object-cover rounded-full border-4 border-pink-300 shadow-lg mx-auto mb-2"
              />
              <h3 className="font-bold text-gray-800">{match.petA.name}</h3>
              <p className="text-sm text-gray-600">{match.petA.owner.name}</p>
            </div>

            {/* Coração central */}
            <div className="text-4xl animate-pulse">💕</div>

            {/* Pet B */}
            <div className="text-center">
              <img 
                src={match.petB.photoUrl} 
                alt={match.petB.name}
                className="w-20 h-20 object-cover rounded-full border-4 border-purple-300 shadow-lg mx-auto mb-2"
              />
              <h3 className="font-bold text-gray-800">{match.petB.name}</h3>
              <p className="text-sm text-gray-600">{match.petB.owner.name}</p>
            </div>
          </div>

          {/* Mensagem motivacional */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4 mb-6 text-center">
            <p className="text-gray-700 font-medium">
              🐾 Que incrível! Agora vocês podem conversar e marcar encontros para seus pets!
            </p>
          </div>

          {/* Botões de ação */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-all duration-200"
            >
              Continuar Swipando
            </button>
            <button
              onClick={onStartChat}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              💬 Iniciar Conversa
            </button>
          </div>
        </div>

        {/* Decoração de fundo */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-400 to-purple-500"></div>
      </div>
    </div>
  );
}
