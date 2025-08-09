import { DailyWeatherData, ActivityType } from '../../types/shared.types';

export interface ActivityRanking {
  activity: ActivityType;
  score: number;
  reason: string;
  conditions: {
    temperature: string;
    weather: string;
    suitability: 'excellent' | 'good' | 'fair' | 'poor';
  };
}

export interface DailyRanking {
  date: string;
  weather: DailyWeatherData;
  rankings: ActivityRanking[];
}

export interface LocationWeatherRanking {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  forecast: DailyRanking[];
}