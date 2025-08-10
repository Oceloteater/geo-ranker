import React from 'react';
import { ActivityRanking } from '../types/api.types';
import { formatActivityName, getActivityEmoji, getSuitabilityColor } from '../utils/formatters';

interface ActivityRankingCardProps {
  ranking: ActivityRanking;
}

const ActivityRankingCard: React.FC<ActivityRankingCardProps> = ({ ranking }) => {
  return (
    <div 
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
  );
};

export default ActivityRankingCard;