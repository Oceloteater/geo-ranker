import React from 'react';
import { ApolloError } from '@apollo/client';
import { Location, LocationWeatherRanking } from '../types/api.types';
import { getUserFriendlyError } from '../services/errorHandler';
import DailyForecastCard from './DailyForecastCard';

interface ActivityRankingsProps {
  selectedLocation: Location | null;
  rankings: LocationWeatherRanking | undefined;
  loading: boolean;
  error: ApolloError | undefined;
}

const ActivityRankings: React.FC<ActivityRankingsProps> = ({
  selectedLocation,
  rankings,
  loading,
  error
}) => {
  if (!selectedLocation) return null;

  return (
    <div>
      <h2>🏆 Activity Rankings for {selectedLocation.name}</h2>
      
      {loading && (
        <div style={{ color: '#666' }}>Loading activity rankings...</div>
      )}
      
      {error && (
        <div style={{ color: 'red', padding: '10px', backgroundColor: '#ffebee', borderRadius: '4px' }}>
          <strong>Rankings Error:</strong> {getUserFriendlyError(error)}
        </div>
      )}
      
      {rankings && (
        <div>
          <h3>📊 7-Day Forecast</h3>
          {rankings.forecast.map((dailyRanking, dayIndex) => (
            <DailyForecastCard 
              key={dayIndex}
              dailyRanking={dailyRanking}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityRankings;