import React from 'react';
import { ApolloError } from '@apollo/client';
import { getUserFriendlyError } from '../services/errorHandler';

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
  return (
    <div style={{ marginBottom: '20px' }}>
      <h2>Search Locations</h2>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          placeholder="Enter city name (e.g., Cape Town, London)"
          style={{ 
            padding: '10px', 
            width: '300px', 
            marginRight: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
        <button 
          type="submit" 
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
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