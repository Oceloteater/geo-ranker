import React from 'react';
import { exampleQueries, exampleLocationQuery } from '../types/examples';

interface QuickExamplesProps {
  onSearchExample: (query: string) => void;
  onDirectLocationQuery: () => void;
}

const QuickExamples: React.FC<QuickExamplesProps> = ({
  onSearchExample,
  onDirectLocationQuery
}) => {
  return (
    <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0f8ff', borderRadius: '8px' }}>
      <h3>🚀 Quick Examples</h3>
      <div style={{ marginBottom: '10px' }}>
        <strong>Search Locations:</strong>
        {exampleQueries.map((example, index) => (
          <button
            key={index}
            onClick={() => onSearchExample(example.query)}
            style={{
              margin: '0 5px',
              padding: '5px 10px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            {example.name}
          </button>
        ))}
      </div>
      <div>
        <strong>Direct Activity Rankings:</strong>
        <button
          onClick={onDirectLocationQuery}
          style={{
            margin: '0 5px',
            padding: '5px 10px', 
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          {exampleLocationQuery.city} Rankings
        </button>
      </div>
    </div>
  );
};

export default QuickExamples;