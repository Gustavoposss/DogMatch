import React, { useState, useEffect } from 'react';
import type { FilterOptions, SwipeFilters } from '../services/swipeService';

interface FilterPanelProps {
  filters: SwipeFilters;
  onFiltersChange: (filters: SwipeFilters) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ 
  filters, 
  onFiltersChange, 
  onApplyFilters, 
  onClearFilters 
}) => {
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const { getFilterOptions } = await import('../services/swipeService');
        const options = await getFilterOptions();
        setFilterOptions(options);
      } catch (error) {
        console.error('Erro ao carregar opções de filtros:', error);
      }
    };

    loadFilterOptions();
  }, []);

  const handleFilterChange = (key: keyof SwipeFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleClearFilters = () => {
    onClearFilters();
    setIsOpen(false);
  };

  const handleApplyFilters = () => {
    onApplyFilters();
    setIsOpen(false);
  };

  if (!filterOptions) {
    return <div>Carregando filtros...</div>;
  }

  return (
    <div style={{ marginBottom: 20 }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '10px 20px',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          marginBottom: 10
        }}
      >
        {isOpen ? '🔽 Ocultar Filtros' : '🔍 Mostrar Filtros'}
      </button>

      {isOpen && (
        <div style={{
          background: '#f8f9fa',
          padding: 20,
          borderRadius: 12,
          border: '1px solid #dee2e6'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: 20 }}>Filtros</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 15 }}>
            {/* Cidade */}
            <div>
              <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
                Cidade:
              </label>
              <select
                value={filters.city || ''}
                onChange={(e) => handleFilterChange('city', e.target.value || undefined)}
                style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
              >
                <option value="">Todas as cidades</option>
                {filterOptions.cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Raça */}
            <div>
              <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
                Raça:
              </label>
              <input
                type="text"
                placeholder="Digite a raça..."
                value={filters.breed || ''}
                onChange={(e) => handleFilterChange('breed', e.target.value || undefined)}
                style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
              />
            </div>

            {/* Tamanho */}
            <div>
              <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
                Tamanho:
              </label>
              <select
                value={filters.size || ''}
                onChange={(e) => handleFilterChange('size', e.target.value || undefined)}
                style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
              >
                <option value="">Qualquer tamanho</option>
                {filterOptions.sizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>

            {/* Gênero */}
            <div>
              <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
                Gênero:
              </label>
              <select
                value={filters.gender || ''}
                onChange={(e) => handleFilterChange('gender', e.target.value || undefined)}
                style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
              >
                <option value="">Qualquer gênero</option>
                {filterOptions.genders.map(gender => (
                  <option key={gender} value={gender}>{gender === 'M' ? 'Macho' : 'Fêmea'}</option>
                ))}
              </select>
            </div>

            {/* Idade Mínima */}
            <div>
              <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
                Idade Mínima:
              </label>
              <select
                value={filters.minAge || ''}
                onChange={(e) => handleFilterChange('minAge', e.target.value ? parseInt(e.target.value) : undefined)}
                style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
              >
                <option value="">Qualquer idade</option>
                {filterOptions.ages.map(age => (
                  <option key={age} value={age}>{age} anos</option>
                ))}
              </select>
            </div>

            {/* Idade Máxima */}
            <div>
              <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
                Idade Máxima:
              </label>
              <select
                value={filters.maxAge || ''}
                onChange={(e) => handleFilterChange('maxAge', e.target.value ? parseInt(e.target.value) : undefined)}
                style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
              >
                <option value="">Qualquer idade</option>
                {filterOptions.ages.map(age => (
                  <option key={age} value={age}>{age} anos</option>
                ))}
              </select>
            </div>

            {/* Objetivo */}
            <div>
              <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
                Objetivo:
              </label>
              <select
                value={filters.objective || ''}
                onChange={(e) => handleFilterChange('objective', e.target.value || undefined)}
                style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
              >
                <option value="">Qualquer objetivo</option>
                {filterOptions.objectives.map(objective => (
                  <option key={objective} value={objective}>{objective}</option>
                ))}
              </select>
            </div>

            {/* Castrado */}
            <div>
              <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
                Castrado:
              </label>
              <select
                value={filters.isNeutered?.toString() || ''}
                onChange={(e) => handleFilterChange('isNeutered', e.target.value === '' ? undefined : e.target.value === 'true')}
                style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
              >
                <option value="">Qualquer</option>
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </select>
            </div>
          </div>

          {/* Botões de ação */}
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button
              onClick={handleApplyFilters}
              style={{
                padding: '10px 20px',
                background: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Aplicar Filtros
            </button>
            <button
              onClick={handleClearFilters}
              style={{
                padding: '10px 20px',
                background: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel; 