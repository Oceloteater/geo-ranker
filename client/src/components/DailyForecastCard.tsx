import React from 'react';
import { DailyRanking } from '../types/api.types';
import { formatDate, formatTemperatureRange, formatPrecipitation, formatWindSpeed } from '../utils/formatters';
import ActivityRankingCard from './ActivityRankingCard';

interface DailyForecastCardProps {
  dailyRanking: DailyRanking;
  isCompact?: boolean;
}

const DailyForecastCard: React.FC<DailyForecastCardProps> = ({ dailyRanking, isCompact = false }) => {
  const sortedRankings = dailyRanking.rankings && dailyRanking.rankings.length > 0 
    ? [...dailyRanking.rankings].sort((a, b) => b.score - a.score)
    : [];

  const getCardStyle = () => ({
    border: '1px solid #eee',
    borderRadius: isCompact ? '12px' : '8px',
    padding: isCompact ? '16px' : '15px',
    backgroundColor: '#fafafa',
    height: isCompact ? '100%' : 'auto',
    display: 'flex',
    flexDirection: 'column' as const,
    boxShadow: isCompact ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
    transition: 'all 0.2s ease',
    marginBottom: isCompact ? '0' : '20px'
  });

  const getDateStyle = () => ({
    fontSize: isCompact ? '16px' : '18px',
    marginBottom: isCompact ? '8px' : '10px',
    fontWeight: 'bold' as const
  });

  const getWeatherSummaryStyle = () => ({
    marginBottom: isCompact ? '12px' : '10px',
    fontSize: isCompact ? '12px' : '14px',
    color: '#666',
    lineHeight: isCompact ? '1.4' : '1.5'
  });

  return (
    <div style={getCardStyle()}>
      <h4 style={getDateStyle()}>📅 {formatDate(dailyRanking.date)}</h4>
      
      {/* Weather Summary */}
      <div style={getWeatherSummaryStyle()}>
        🌡️ {formatTemperatureRange(dailyRanking.weather.temperatureMin, dailyRanking.weather.temperatureMax)}
        <br />
        🌧️ {formatPrecipitation(dailyRanking.weather.precipitation)} | 
        💨 {formatWindSpeed(dailyRanking.weather.windSpeed)}
      </div>
      
      {/* Activity Rankings */}
      <div style={{ 
        display: 'grid', 
        gap: isCompact ? '6px' : '8px',
        flex: 1
      }}>
        {sortedRankings.length > 0 ? 
          sortedRankings.map((ranking, rankIndex) => (
            <ActivityRankingCard 
              key={rankIndex}
              ranking={ranking}
              isCompact={isCompact}
            />
          )) : 
          <div style={{ color: '#666', fontStyle: 'italic', fontSize: '14px' }}>
            No activity rankings available for this day.
          </div>
        }
      </div>
    </div>
  );
};

export default DailyForecastCard;