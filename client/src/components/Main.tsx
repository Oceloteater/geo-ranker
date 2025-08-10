import React, { useState } from 'react';
import { useGeoRankerWorkflow } from '../hooks/useGeoRankerApi';
import { Location } from '../types/api.types';
import { 
  formatDate, 
  formatTemperatureRange, 
  formatActivityName, 
  getActivityEmoji, 
  getSuitabilityColor,
  formatCoordinates,
  formatPrecipitation,
  formatWindSpeed
} from '../utils/formatters';
import { getUserFriendlyError } from '../services/errorHandler';

const Main: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Example queries from your specification
  const exampleQueries = [
    { name: 'Cape Town', query: 'Cape Town' },
    { name: 'London', query: 'London' },
    { name: 'New York', query: 'New York' },
    { name: 'Tokyo', query: 'Tokyo' }
  ];

  const exampleLocationQuery = {
    city: "Cape Town",
    country: "South Africa",
    latitude: -34.125,
    longitude: 18.291
  };

  const {
    searchLocations,
    locations,
    searchLoading,
    searchError,
    selectedLocation,
    selectLocation,
    rankings,
    rankingsLoading,
    rankingsError
  } = useGeoRankerWorkflow();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchLocations(searchQuery);
    }
  };

  const handleLocationSelect = (location: Location) => {
    selectLocation(location);
  };

  const handleExampleQuery = (exampleQuery: string) => {
    setSearchQuery(exampleQuery);
    searchLocations(exampleQuery);
  };

  const handleDirectLocationQuery = () => {
    selectLocation({
      name: exampleLocationQuery.city,
      country: exampleLocationQuery.country,
      latitude: exampleLocationQuery.latitude,
      longitude: exampleLocationQuery.longitude,
      timezone: 'Africa/Johannesburg'
    });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🌦️ Geo-Ranker</h1>
      
      {/* Quick Examples */}
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0f8ff', borderRadius: '8px' }}>
        <h3>🚀 Quick Examples</h3>
        <div style={{ marginBottom: '10px' }}>
          <strong>Search Locations:</strong>
          {exampleQueries.map((example, index) => (
            <button
              key={index}
              onClick={() => handleExampleQuery(example.query)}
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
            onClick={handleDirectLocationQuery}
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
            Cape Town Rankings
          </button>
        </div>
      </div>
      
      {/* Search Form */}
      <div style={{ marginBottom: '20px' }}>
        <h2>Search Locations</h2>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
            disabled={searchLoading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: searchLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {searchLoading ? 'Searching...' : 'Search'}
          </button>
        </form>
        
        {searchError && (
          <div style={{ color: 'red', marginTop: '10px', padding: '10px', backgroundColor: '#ffebee', borderRadius: '4px' }}>
            <strong>Search Error:</strong> {getUserFriendlyError(searchError)}
          </div>
        )}
      </div>

      {/* Location Results */}
      {locations.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2>📍 Found Locations ({locations.length})</h2>
          <div style={{ display: 'grid', gap: '10px' }}>
            {locations.map((location, index) => (
              <div 
                key={index}
                onClick={() => handleLocationSelect(location)}
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
      )}

      {/* Activity Rankings */}
      {selectedLocation && (
        <div>
          <h2>🏆 Activity Rankings for {selectedLocation.name}</h2>
          
          {rankingsLoading && (
            <div style={{ color: '#666' }}>Loading activity rankings...</div>
          )}
          
          {rankingsError && (
            <div style={{ color: 'red', padding: '10px', backgroundColor: '#ffebee', borderRadius: '4px' }}>
              <strong>Rankings Error:</strong> {getUserFriendlyError(rankingsError)}
            </div>
          )}
          
          {rankings && (
            <div>
              <h3>📊 7-Day Forecast</h3>
              {rankings.forecast.map((day, dayIndex) => (
                <div 
                  key={dayIndex}
                  style={{
                    marginBottom: '20px',
                    border: '1px solid #eee',
                    borderRadius: '8px',
                    padding: '15px',
                    backgroundColor: '#fafafa'
                  }}
                >
                  <h4>📅 {formatDate(day.date)}</h4>
                  
                  {/* Weather Summary */}
                  <div style={{ marginBottom: '10px', fontSize: '14px', color: '#666' }}>
                    🌡️ {formatTemperatureRange(day.weather.temperatureMin, day.weather.temperatureMax)} | 
                    🌧️ {formatPrecipitation(day.weather.precipitation)} | 
                    💨 {formatWindSpeed(day.weather.windSpeed)}
                  </div>
                  
                  {/* Activity Rankings */}
                  <div style={{ display: 'grid', gap: '8px' }}>
                    {day.rankings && day.rankings.length > 0 ? 
                      [...day.rankings] // Create a shallow copy to avoid mutation
                        .sort((a, b) => b.score - a.score) // Sort by score descending
                        .map((ranking, rankIndex) => (
                        <div 
                          key={rankIndex}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '8px 12px',
                            backgroundColor: 'white',
                            borderRadius: '4px',
                            border: `2px solid ${getSuitabilityColor(ranking.conditions.suitability)}`
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <strong>{getActivityEmoji(ranking.activity)} {formatActivityName(ranking.activity)}</strong>
                            <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                              {ranking.reason}
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                              {ranking.score}
                            </div>
                            <div style={{ 
                              fontSize: '12px', 
                              color: getSuitabilityColor(ranking.conditions.suitability),
                              textTransform: 'capitalize'
                            }}>
                              {ranking.conditions.suitability}
                            </div>
                          </div>
                        </div>
                      )) : 
                      <div style={{ color: '#666', fontStyle: 'italic' }}>
                        No activity rankings available for this day.
                      </div>
                    }
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Main;