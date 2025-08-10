import React from 'react';
import { DailyRanking } from '../types/api.types';
import { formatDate, formatTemperatureRange, formatPrecipitation, formatWindSpeed } from '../utils/formatters';
import ActivityRankingCard from './ActivityRankingCard';

interface DailyForecastCardProps {
  dailyRanking: DailyRanking;
}

const DailyForecastCard: React.FC<DailyForecastCardProps> = ({ dailyRanking }) => {
  const sortedRankings = dailyRanking.rankings && dailyRanking.rankings.length > 0 
    ? [...dailyRanking.rankings].sort((a, b) => b.score - a.score)
    : [];

  return (
    <div 
      style={{
        marginBottom: '20px',
        border: '1px solid #eee',
        borderRadius: '8px',
        padding: '15px',
        backgroundColor: '#fafafa'
      }}
    >
      <h4>📅 {formatDate(dailyRanking.date)}</h4>
      
      {/* Weather Summary */}
      <div style={{ marginBottom: '10px', fontSize: '14px', color: '#666' }}>
        🌡️ {formatTemperatureRange(dailyRanking.weather.temperatureMin, dailyRanking.weather.temperatureMax)} | 
        🌧️ {formatPrecipitation(dailyRanking.weather.precipitation)} | 
        💨 {formatWindSpeed(dailyRanking.weather.windSpeed)}
      </div>
      
      {/* Activity Rankings */}
      <div style={{ display: 'grid', gap: '8px' }}>
        {sortedRankings.length > 0 ? 
          sortedRankings.map((ranking, rankIndex) => (
            <ActivityRankingCard 
              key={rankIndex}
              ranking={ranking}
            />
          )) : 
          <div style={{ color: '#666', fontStyle: 'italic' }}>
            No activity rankings available for this day.
          </div>
        }
      </div>
    </div>
  );
};

export default DailyForecastCard;