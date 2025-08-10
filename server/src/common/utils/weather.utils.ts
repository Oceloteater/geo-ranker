import { IDailyWeatherData } from '../types';

/**
 * Generates a human-readable weather description from weather data
 * @param weather Daily weather data
 * @returns String description of weather conditions
 */
export const getWeatherDescription = (weather: IDailyWeatherData): string => {
  const conditions = [];
  
  if (weather.precipitation > 10) conditions.push('heavy rain');
  else if (weather.precipitation > 2) conditions.push('light rain');
  
  if (weather.cloudCover > 80) conditions.push('overcast');
  else if (weather.cloudCover > 50) conditions.push('partly cloudy');
  else conditions.push('clear');
  
  if (weather.windSpeed > 25) conditions.push('windy');
  
  return conditions.join(', ') || 'clear';
};