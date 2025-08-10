import { ActivityType, SuitabilityType } from '../types/api.types';

// =============================================================================
// DATE FORMATTERS
// =============================================================================

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });
};

export const formatShortDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};

// =============================================================================
// WEATHER FORMATTERS
// =============================================================================

export const formatTemperature = (temp: number): string => {
  return `${Math.round(temp)}°C`;
};

export const formatTemperatureRange = (min: number, max: number): string => {
  return `${formatTemperature(min)} - ${formatTemperature(max)}`;
};

export const formatPrecipitation = (precip: number): string => {
  return `${precip.toFixed(1)}mm`;
};

export const formatWindSpeed = (speed: number): string => {
  return `${Math.round(speed)}km/h`;
};

export const formatHumidity = (humidity: number): string => {
  return `${Math.round(humidity)}%`;
};

// =============================================================================
// ACTIVITY FORMATTERS
// =============================================================================

export const formatActivityName = (activity: ActivityType): string => {
  return activity
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const getActivityEmoji = (activity: ActivityType): string => {
  const emojis: Record<ActivityType, string> = {
    'skiing': '⛷️',
    'surfing': '🏄‍♂️',
    'outdoor-sightseeing': '🚶‍♂️',
    'indoor-sightseeing': '🏛️'
  };
  return emojis[activity];
};

// =============================================================================
// SUITABILITY FORMATTERS
// =============================================================================

export const getSuitabilityColor = (suitability: SuitabilityType): string => {
  const colors: Record<SuitabilityType, string> = {
    'excellent': '#4caf50',
    'good': '#8bc34a', 
    'fair': '#ff9800',
    'poor': '#f44336'
  };
  return colors[suitability];
};

export const getSuitabilityEmoji = (suitability: SuitabilityType): string => {
  const emojis: Record<SuitabilityType, string> = {
    'excellent': '🌟',
    'good': '✅',
    'fair': '⚠️',
    'poor': '❌'
  };
  return emojis[suitability];
};

// =============================================================================
// COORDINATE FORMATTERS
// =============================================================================

export const formatCoordinates = (lat: number, lng: number): string => {
  return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
};

// =============================================================================
// SCORE FORMATTERS
// =============================================================================

export const formatScore = (score: number): string => {
  return score.toString();
};

export const getScoreColor = (score: number): string => {
  if (score >= 85) return '#4caf50'; // Excellent - Green
  if (score >= 65) return '#8bc34a'; // Good - Light Green  
  if (score >= 45) return '#ff9800'; // Fair - Orange
  return '#f44336'; // Poor - Red
};