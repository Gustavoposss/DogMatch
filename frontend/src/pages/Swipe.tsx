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
      <div style={{ textAlign: 'center', padding: 40 }}>
        <h2>Carregando pets...</h2>
      </div>
    );
  }

  if (!currentPet) {
    return (
      <div style={{ maxWidth: 600, margin: '40px auto', textAlign: 'center' }}>
        <FilterPanel
          filters={filters}
          onFiltersChange={setFilters}
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
        />
        <h2>Não há mais pets para avaliar!</h2>
        <p>Volte mais tarde para novos matches ou tente ajustar os filtros.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', textAlign: 'center' }}>
      <h2>Swipe para encontrar matches!</h2>
      
      {/* Painel de Filtros */}
      <FilterPanel
        filters={filters}
        onFiltersChange={setFilters}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      />

      {/* Filtros Ativos */}
      <ActiveFilters
        filters={filters}
        onRemoveFilter={handleRemoveFilter}
      />
      
      {/* Seleção do pet do usuário */}
      <div style={{ marginBottom: 20 }}>
        <h3>Selecione seu pet:</h3>
        <select 
          value={selectedPet?.id || ''} 
          onChange={(e) => {
            const pet = userPets.find(p => p.id === e.target.value);
            setSelectedPet(pet);
          }}
          style={{ padding: 8, marginBottom: 10 }}
        >
          <option value="">Escolha seu pet</option>
          {userPets.map(pet => (
            <option key={pet.id} value={pet.id}>{pet.name}</option>
          ))}
        </select>
      </div>

      {/* Card do pet para avaliar */}
      {selectedPet && (
        <div style={{
          background: '#fff',
          borderRadius: 12,
          boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          marginBottom: 20
        }}>
          <img
            src={currentPet.photoUrl}
            alt={currentPet.name}
            style={{ width: '100%', height: 300, objectFit: 'cover' }}
          />
          <div style={{ padding: 20 }}>
            <h3>{currentPet.name}, {currentPet.age} anos</h3>
            <p><strong>Raça:</strong> {currentPet.breed}</p>
            <p><strong>Tamanho:</strong> {currentPet.size}</p>
            <p><strong>Gênero:</strong> {currentPet.gender === 'M' ? 'Macho' : 'Fêmea'}</p>
            <p><strong>Objetivo:</strong> {currentPet.objective}</p>
            <p><strong>Castrado:</strong> {currentPet.isNeutered ? 'Sim' : 'Não'}</p>
            {currentPet.owner && (
              <p><strong>Localização:</strong> {currentPet.owner.city}</p>
            )}
            <p>{currentPet.description || 'Sem descrição'}</p>
          </div>
        </div>
      )}

      {/* Botões de like/dislike */}
      {selectedPet && (
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
          <button
            onClick={handleDislike}
            style={{
              padding: '12px 24px',
              background: '#ff4757',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer'
            }}
          >
            ❌ Não
          </button>
          <button
            onClick={handleLike}
            style={{
              padding: '12px 24px',
              background: '#2ed573',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer'
            }}
          >
            ❤️ Sim
          </button>
        </div>
      )}
    </div>
  );
}

export default Swipe;