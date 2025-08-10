import React from 'react';
import { Location } from '../types/api.types';
import { formatCoordinates } from '../utils/formatters';

interface LocationResultsProps {
  locations: Location[];
  selectedLocation: Location | null;
  onLocationSelect: (location: Location) => void;
}

const LocationResults: React.FC<LocationResultsProps> = ({
  locations,
  selectedLocation,
  onLocationSelect
}) => {
  if (locations.length === 0) return null;

  return (
    <div style={{ marginBottom: '20px' }}>
      <h2>📍 Found Locations ({locations.length})</h2>
      <div style={{ display: 'grid', gap: '10px' }}>
        {locations.map((location, index) => (
          <div 
            key={index}
            onClick={() => onLocationSelect(location)}
            style={{
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
              backgroundColor: selectedLocation?.name === location.name ? '#e3f2fd' : '#f9f9f9',
              transition: 'background-color 0.2s'
            }}
          >
            <strong>{location.name}</strong>, {location.country}
            <br />
            <small>
              📍 {formatCoordinates(location.latitude, location.longitude)} 
              | 🕐 {location.timezone}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationResults;