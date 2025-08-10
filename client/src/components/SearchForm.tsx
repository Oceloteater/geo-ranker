import React from 'react';
import { ApolloError } from '@apollo/client';
import { getUserFriendlyError } from '../services/errorHandler';
import { useResponsive } from '../hooks/useResponsive';

interface SearchFormProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  error: ApolloError | undefined;
}

const SearchForm: React.FC<SearchFormProps> = ({
  searchQuery,
  onSearchQueryChange,
  onSubmit,
  loading,
  error
}) => {
  const { isMobile } = useResponsive();

  const getContainerStyle = () => ({
    marginBottom: '24px',
    backgroundColor: 'white',
    padding: isMobile ? '16px' : '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  });

  const getFormStyle = () => ({
    display: 'flex',
    flexDirection: isMobile ? 'column' as const : 'row' as const,
    gap: isMobile ? '12px' : '10px',
    alignItems: isMobile ? 'stretch' : 'center'
  });

  const getInputStyle = () => ({
    padding: '12px 16px',
    width: isMobile ? '100%' : '300px',
    border: '2px solid #e3f2fd',
    borderRadius: '8px',
    fontSize: '16px', // Prevents zoom on iOS
    outline: 'none',
    transition: 'border-color 0.2s ease',
    '&:focus': {
      borderColor: '#007bff'
    }
  });

  const getButtonStyle = () => ({
    padding: '12px 24px',
    backgroundColor: loading ? '#6c757d' : '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: loading ? 'not-allowed' : 'pointer',
    fontWeight: 'bold' as const,
    fontSize: '16px',
    transition: 'all 0.2s ease',
    minWidth: isMobile ? '100%' : 'auto'
  });

  return (
    <div style={getContainerStyle()}>
      <h2 style={{ marginTop: 0, marginBottom: '16px', color: '#2c3e50' }}>Search Locations</h2>
      <form onSubmit={onSubmit} style={getFormStyle()}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          placeholder="Enter city name (e.g., Cape Town, London)"
          style={getInputStyle()}
          disabled={loading}
        />
        <button 
          type="submit" 
          disabled={loading || !searchQuery.trim()}
          style={getButtonStyle()}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
      
      {error && (
        <div style={{ color: 'red', marginTop: '10px', padding: '10px', backgroundColor: '#ffebee', borderRadius: '4px' }}>
          <strong>Search Error:</strong> {getUserFriendlyError(error)}
        </div>
      )}
    </div>
  );
};

export default SearchForm;