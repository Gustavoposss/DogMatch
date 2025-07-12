import React from 'react';
import type { SwipeFilters } from '../services/swipeService';

interface ActiveFiltersProps {
  filters: SwipeFilters;
  onRemoveFilter: (key: keyof SwipeFilters) => void;
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({ filters, onRemoveFilter }) => {
  const getFilterLabel = (key: keyof SwipeFilters, value: any): string => {
    switch (key) {
      case 'gender':
        return value === 'M' ? 'Macho' : 'Fêmea';
      case 'size':
        return value;
      case 'objective':
        return value;
      case 'city':
        return value;
      case 'breed':
        return value;
      case 'minAge':
        return `Idade mín: ${value} anos`;
      case 'maxAge':
        return `Idade máx: ${value} anos`;
      case 'isNeutered':
        return value ? 'Castrado' : 'Não castrado';
      default:
        return String(value);
    }
  };

  const activeFilters = Object.entries(filters).filter(([_, value]) => 
    value !== undefined && value !== null && value !== ''
  );

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div style={{ marginBottom: 15 }}>
      <h4 style={{ marginBottom: 10 }}>Filtros Ativos:</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {activeFilters.map(([key, value]) => (
          <span
            key={key}
            style={{
              background: '#e3f2fd',
              color: '#1976d2',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {getFilterLabel(key as keyof SwipeFilters, value)}
            <button
              onClick={() => onRemoveFilter(key as keyof SwipeFilters)}
              style={{
                background: 'none',
                border: 'none',
                color: '#1976d2',
                cursor: 'pointer',
                fontSize: '16px',
                padding: 0,
                marginLeft: '4px'
              }}
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default ActiveFilters; 