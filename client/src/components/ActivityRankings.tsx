import React from 'react';
import { ApolloError } from '@apollo/client';
import { Location, LocationWeatherRanking } from '../types/api.types';
import { getUserFriendlyError } from '../services/errorHandler';
import { useResponsive } from '../hooks/useResponsive';
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
  const { isMobile, isTablet, isDesktop } = useResponsive();
  
  if (!selectedLocation) return null;

  // Responsive grid configuration
  const getGridStyle = () => {
    if (isMobile) {
      return { display: 'flex', flexDirection: 'column' as const, gap: '16px' };
    } else if (isTablet) {
      return { 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: '20px'
      };
    } else {
      return { 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '24px'
      };
    }
  };

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
          <div style={getGridStyle()}>
            {rankings.forecast.map((dailyRanking, dayIndex) => (
              <DailyForecastCard 
                key={dayIndex}
                dailyRanking={dailyRanking}
                isCompact={isDesktop}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityRankings;