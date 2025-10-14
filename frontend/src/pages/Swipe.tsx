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
  const [filters, setFilters] = useState<SwipeFilters>({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasPet, setHasPet] = useState(true);
  const token = localStorage.getItem('token');
  let userId = '';

  if (token) {
    const decoded = jwtDecode<JwtPayload>(token);
    userId = decoded.userId;
  }

  const loadPetsToSwipe = async () => {
    if (token) {
      setIsLoading(true);
      try {
        const pets = await getPetsToSwipe(token, filters);
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
      // Verificar se o usuário tem pets cadastrados
      getPetsByUser(userId, token)
        .then(pets => {
          setUserPets(pets);
          setHasPet(pets.length > 0);
        })
        .catch(() => {
          setUserPets([]);
          setHasPet(false);
        });
    }
  }, [userId, token]);

  const handleLike = async () => {
    if (currentPetIndex < petsToSwipe.length) {
      const currentPet = petsToSwipe[currentPetIndex];
      try {
        const result = await likePet(currentPet.id, token!);
        if (result.isMatch) {
          alert('🎉 É um Match! Vocês se curtiram!');
        } else {
          alert('❤️ Like enviado!');
        }
      } catch (error: any) {
        if (error.response?.data?.limitReached) {
          alert('⚠️ ' + error.response.data.error);
        } else {
          alert('❌ Erro ao enviar like');
        }
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

  if (!hasPet) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">⚠️ Você precisa cadastrar um pet primeiro!</h2>
          <p className="text-gray-600 mb-4">Para dar likes e encontrar matches, cadastre pelo menos um pet.</p>
          <a 
            href="/pets" 
            className="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-all"
          >
            Cadastrar Meu Pet
          </a>
        </div>
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
      {/* Informação sobre qual pet está dando like */}
      {userPets.length > 0 && (
        <div className="w-full max-w-2xl mb-4 flex justify-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Dando like como:</span> {userPets[0].name} 🐕
            </p>
          </div>
        </div>
      )}
      {/* Card do pet para avaliar */}
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
      {/* Botões de like/dislike */}
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
    </div>
  );
}

export default Swipe;