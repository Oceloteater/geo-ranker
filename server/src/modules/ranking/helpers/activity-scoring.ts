import { DailyWeatherData } from '../../../types/shared.types';

/**
 * Note that this engine has hardcoded values but in a real app this would be all config driven
 * For example: what is cold and what's hot is a matter of opinion, based on the data we get back
 * Assume these values would be the defaults set, unless someone read-in a config file
 *
 * @param weather
 * @param avgTemp
 */
export const calculateSkiingScore = (weather: DailyWeatherData, avgTemp: number): number => {
  let score = 0;
  
  // Temperature scoring (cold is good for skiing)
  if (avgTemp >= -5 && avgTemp <= 5) score += 40;
  else if (avgTemp >= -15 && avgTemp <= 10) score += 25;
  else score += 5;
  
  // Precipitation (some snow is good, too much rain is bad)
  if (weather.precipitation < 2) score += 20;
  else if (weather.precipitation < 10) score += 10;
  else score += 0;
  
  // Cloud cover (some clouds ok for skiing)
  if (weather.cloudCover < 70) score += 15;
  else score += 10;
  
  // Wind (moderate wind ok)
  if (weather.windSpeed < 20) score += 15;
  else if (weather.windSpeed < 30) score += 10;
  else score += 0;
  
  // UV Index (higher at altitude, some protection needed)
  if (weather.uvIndex <= 7) score += 10;
  else score += 5;
  
  return Math.min(100, score);
};

export const calculateSurfingScore = (weather: DailyWeatherData, avgTemp: number): number => {
  let score = 0;
  
  // Temperature (warm is good)
  if (avgTemp >= 20 && avgTemp <= 30) score += 30;
  else if (avgTemp >= 15 && avgTemp <= 35) score += 20;
  else score += 5;
  
  // Wind (moderate wind good for waves, but not too strong)
  if (weather.windSpeed >= 10 && weather.windSpeed <= 25) score += 25;
  else if (weather.windSpeed >= 5 && weather.windSpeed <= 35) score += 15;
  else score += 5;
  
  // Precipitation (less rain is better)
  if (weather.precipitation < 2) score += 20;
  else if (weather.precipitation < 5) score += 15;
  else score += 5;
  
  // Cloud cover (some sun is nice)
  if (weather.cloudCover < 50) score += 15;
  else if (weather.cloudCover < 80) score += 10;
  else score += 5;
  
  // UV Index (sun protection needed)
  if (weather.uvIndex <= 8) score += 10;
  else score += 5;
  
  return Math.min(100, score);
};

export const calculateOutdoorSightseeingScore = (weather: DailyWeatherData, avgTemp: number): number => {
  let score = 0;
  
  // Temperature (mild is best)
  if (avgTemp >= 15 && avgTemp <= 25) score += 35;
  else if (avgTemp >= 5 && avgTemp <= 30) score += 25;
  else score += 10;
  
  // Precipitation (dry is best)
  if (weather.precipitation < 1) score += 25;
  else if (weather.precipitation < 5) score += 15;
  else score += 5;
  
  // Cloud cover (mix of sun and clouds ideal)
  if (weather.cloudCover >= 20 && weather.cloudCover <= 60) score += 20;
  else if (weather.cloudCover < 80) score += 15;
  else score += 5;
  
  // Wind (light wind pleasant)
  if (weather.windSpeed < 15) score += 15;
  else if (weather.windSpeed < 25) score += 10;
  else score += 0;
  
  // UV Index (moderate sun exposure)
  if (weather.uvIndex <= 6) score += 5;
  else score += 3;
  
  return Math.min(100, score);
};

export const calculateIndoorSightseeingScore = (weather: DailyWeatherData, avgTemp: number): number => {
  let score = 50; // Base score since weather matters less
  
  // Bad weather makes indoor activities more appealing
  if (weather.precipitation > 10) score += 25;
  else if (weather.precipitation > 5) score += 15;
  else score += 10;
  
  if (weather.cloudCover > 80) score += 10;
  else score += 5;
  
  if (avgTemp < 5 || avgTemp > 30) score += 15;
  else score += 10;
  
  return Math.min(100, score);
};

export const getSkiingReason = (weather: DailyWeatherData, avgTemp: number): string => {
  if (avgTemp >= -5 && avgTemp <= 5) {
    return 'Perfect skiing temperature with good snow conditions';
  } else if (avgTemp > 5) {
    return 'Too warm - snow may be slushy or melting';
  } else {
    return 'Very cold - bundle up but good for powder';
  }
};

export const getSurfingReason = (weather: DailyWeatherData, avgTemp: number): string => {
  if (weather.windSpeed >= 10 && weather.windSpeed <= 25 && avgTemp >= 20) {
    return 'Good wind and warm temperature for surfing';
  } else if (avgTemp < 15) {
    return 'Water temperature may be too cold';
  } else {
    return 'Moderate conditions for surfing';
  }
};

export const getOutdoorSightseeingReason = (weather: DailyWeatherData, avgTemp: number): string => {
  if (weather.precipitation > 5) {
    return 'Rain may limit outdoor activities';
  } else if (avgTemp >= 15 && avgTemp <= 25 && weather.precipitation < 2) {
    return 'Perfect weather for walking and outdoor exploration';
  } else {
    return 'Decent weather for outdoor activities';
  }
};

export const getIndoorSightseeingReason = (weather: DailyWeatherData, avgTemp: number): string => {
  if (weather.precipitation > 10) {
    return 'Rainy weather - perfect for museums and indoor attractions';
  } else if (avgTemp < 5 || avgTemp > 30) {
    return 'Extreme temperatures make indoor activities appealing';
  } else {
    return 'Good weather for both indoor and outdoor activities';
  }
};

export const getWeatherDescription = (weather: DailyWeatherData): string => {
  const conditions = [];
  
  if (weather.precipitation > 10) conditions.push('heavy rain');
  else if (weather.precipitation > 2) conditions.push('light rain');
  
  if (weather.cloudCover > 80) conditions.push('overcast');
  else if (weather.cloudCover > 50) conditions.push('partly cloudy');
  else conditions.push('clear');
  
  if (weather.windSpeed > 25) conditions.push('windy');
  
  return conditions.join(', ') || 'clear';
};