import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { likePet, getPetsToSwipe } from '../services/swipeService';
import type { SwipeFilters } from '../services/swipeService';
import { getPetsByUser } from '../services/petService';
import FilterPanel from '../components/FilterPanel';
import ActiveFilters from '../components/ActiveFilters';

interface JwtPayload {
  userId: string;
}

function Swipe() {
  const [petsToSwipe, setPetsToSwipe] = useState<any[]>([]);
  const [currentPetIndex, setCurrentPetIndex] = useState(0);
  const [userPets, setUserPets] = useState<any[]>([]);
  const [selectedPet, setSelectedPet] = useState<any>(null);
  const [filters, setFilters] = useState<SwipeFilters>({});
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem('token');
  let userId = '';

  if (token) {
    const decoded = jwtDecode<JwtPayload>(token);
    userId = decoded.userId;
  }

  const loadPetsToSwipe = async () => {
    if (userId && token) {
      setIsLoading(true);
      try {
        const pets = await getPetsToSwipe(userId, token, filters);
        setPetsToSwipe(pets);
        setCurrentPetIndex(0);
      } catch (error) {
        console.error('Erro ao carregar pets:', error);
        setPetsToSwipe([]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    loadPetsToSwipe();
  }, [userId, token]);

  useEffect(() => {
    if (userId && token) {
      // Carregar pets do usuário para seleção
      getPetsByUser(userId, token)
        .then(setUserPets)
        .catch(() => setUserPets([]));
    }
  }, [userId, token]);

  const handleLike = async () => {
    if (selectedPet && currentPetIndex < petsToSwipe.length) {
      const currentPet = petsToSwipe[currentPetIndex];
      try {
        await likePet(selectedPet.id, currentPet.id, token!);
        // Verificar se houve match
        alert('Like enviado!');
      } catch (error) {
        alert('Erro ao enviar like');
      }
    }
    setCurrentPetIndex(currentPetIndex + 1);
  };

  const handleDislike = () => {
    setCurrentPetIndex(currentPetIndex + 1);
  };

  const handleApplyFilters = () => {
    loadPetsToSwipe();
  };

  const handleClearFilters = () => {
    setFilters({});
    loadPetsToSwipe();
  };

  const handleRemoveFilter = (key: keyof SwipeFilters) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    setFilters(newFilters);
    // Recarregar pets com os novos filtros
    setTimeout(() => loadPetsToSwipe(), 100);
  };

  const currentPet = petsToSwipe[currentPetIndex];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="text-lg text-gray-500 animate-pulse">Carregando pets...</span>
      </div>
    );
  }

  if (!currentPet) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <FilterPanel
          filters={filters}
          onFiltersChange={setFilters}
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
        />
        <h2 className="text-2xl font-bold text-gray-700 mt-8 mb-2">Não há mais pets para avaliar!</h2>
        <p className="text-gray-500">Volte mais tarde para novos matches ou tente ajustar os filtros.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[100vh] flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-2">
      <h2 className="text-3xl font-bold text-blue-700 mb-4">Swipe para encontrar matches!</h2>
      {/* Painel de Filtros */}
      <div className="w-full max-w-2xl mb-4">
        <FilterPanel
          filters={filters}
          onFiltersChange={setFilters}
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
        />
        <ActiveFilters
          filters={filters}
          onRemoveFilter={handleRemoveFilter}
        />
      </div>
      {/* Seleção do pet do usuário */}
      <div className="w-full max-w-2xl mb-6 flex flex-col items-center">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Selecione seu pet:</h3>
        <select
          value={selectedPet?.id || ''}
          onChange={(e) => {
            const pet = userPets.find(p => p.id === e.target.value);
            setSelectedPet(pet);
          }}
          className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
        >
          <option value="">Escolha seu pet</option>
          {userPets.map(pet => (
            <option key={pet.id} value={pet.id}>{pet.name}</option>
          ))}
        </select>
      </div>
      {/* Card do pet para avaliar */}
      {selectedPet && (
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-6 w-full max-w-xl animate-fade-in">
          <img
            src={currentPet.photoUrl}
            alt={currentPet.name}
            className="w-full h-72 object-cover"
          />
          <div className="p-6 text-left">
            <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              {currentPet.name}, <span className="text-blue-600">{currentPet.age} anos</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 mb-2">
              <p><span className="font-semibold text-gray-700">Raça:</span> {currentPet.breed}</p>
              <p><span className="font-semibold text-gray-700">Tamanho:</span> {currentPet.size}</p>
              <p><span className="font-semibold text-gray-700">Gênero:</span> {currentPet.gender === 'M' ? 'Macho' : 'Fêmea'}</p>
              <p><span className="font-semibold text-gray-700">Objetivo:</span> {currentPet.objective}</p>
              <p><span className="font-semibold text-gray-700">Castrado:</span> {currentPet.isNeutered ? 'Sim' : 'Não'}</p>
              {currentPet.owner && (
                <p><span className="font-semibold text-gray-700">Localização:</span> {currentPet.owner.city}</p>
              )}
            </div>
            <p className="text-gray-600 mt-2">{currentPet.description || 'Sem descrição'}</p>
          </div>
        </div>
      )}
      {/* Botões de like/dislike */}
      {selectedPet && (
        <div className="flex gap-8 justify-center mt-2">
          <button
            onClick={handleDislike}
            className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white text-xl font-bold rounded-full shadow-lg transition-all duration-200 focus:ring-2 focus:ring-red-300 focus:outline-none"
          >
            ❌ Não
          </button>
          <button
            onClick={handleLike}
            className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white text-xl font-bold rounded-full shadow-lg transition-all duration-200 focus:ring-2 focus:ring-green-300 focus:outline-none"
          >
            ❤️ Sim
          </button>
        </div>
      )}
    </div>
  );
}

export default Swipe;