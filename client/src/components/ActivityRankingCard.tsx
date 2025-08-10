import React from 'react';
import { ActivityRanking } from '../types/api.types';
import { formatActivityName, getActivityEmoji, getSuitabilityColor } from '../utils/formatters';

interface ActivityRankingCardProps {
  ranking: ActivityRanking;
  isCompact?: boolean;
}

const ActivityRankingCard: React.FC<ActivityRankingCardProps> = ({ ranking, isCompact = false }) => {
  const getCardStyle = () => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: isCompact ? '6px 10px' : '8px 12px',
    backgroundColor: 'white',
    borderRadius: isCompact ? '6px' : '4px',
    border: `2px solid ${getSuitabilityColor(ranking.conditions.suitability)}`,
    minHeight: isCompact ? '50px' : 'auto'
  });

  const getActivityNameStyle = () => ({
    fontSize: isCompact ? '13px' : '14px',
    fontWeight: 'bold' as const
  });

  const getReasonStyle = (): React.CSSProperties => ({
    fontSize: isCompact ? '10px' : '12px',
    color: '#666',
    marginTop: isCompact ? '1px' : '2px',
    lineHeight: isCompact ? '1.2' : '1.3',
    ...(isCompact ? {
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    } as React.CSSProperties : {
      display: 'block',
      overflow: 'visible'
    })
  });

  const getScoreStyle = () => ({
    fontSize: isCompact ? '16px' : '18px',
    fontWeight: 'bold' as const
  });

  const getSuitabilityStyle = () => ({
    fontSize: isCompact ? '10px' : '12px',
    color: getSuitabilityColor(ranking.conditions.suitability),
    textTransform: 'capitalize' as const
  });

  return (
    <div style={getCardStyle()}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={getActivityNameStyle()}>
          {getActivityEmoji(ranking.activity)} {formatActivityName(ranking.activity)}
        </div>
        <div style={getReasonStyle()}>
          {ranking.reason}
        </div>
      </div>
      <div style={{ textAlign: 'right', marginLeft: isCompact ? '8px' : '12px' }}>
        <div style={getScoreStyle()}>
          {ranking.score}
        </div>
        <div style={getSuitabilityStyle()}>
          {ranking.conditions.suitability}
        </div>
      </div>
    </div>
  );
};

export default ActivityRankingCard;