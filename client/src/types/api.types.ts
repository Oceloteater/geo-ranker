// =============================================================================
// FRONTEND API TYPES
// =============================================================================

export type ActivityType = 'skiing' | 'surfing' | 'outdoor-sightseeing' | 'indoor-sightseeing';

export type SuitabilityType = 'excellent' | 'good' | 'fair' | 'poor';

// =============================================================================
// LOCATION TYPES
// =============================================================================

export interface Location {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

// =============================================================================
// WEATHER TYPES
// =============================================================================

export interface DailyWeather {
  date: string;
  temperatureMax: number;
  temperatureMin: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  precipitation: number;
  cloudCover: number;
  uvIndex: number;
}

// =============================================================================
// ACTIVITY RANKING TYPES
// =============================================================================

export interface ActivityConditions {
  temperature: string;
  weather: string;
  suitability: SuitabilityType;
}

export interface ActivityRanking {
  activity: ActivityType;
  score: number;
  reason: string;
  conditions: ActivityConditions;
}

export interface DailyRanking {
  date: string;
  weather: DailyWeather;
  rankings: ActivityRanking[];
}

export interface LocationWeatherRanking {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  forecast: DailyRanking[];
}

// =============================================================================
// QUERY VARIABLES
// =============================================================================

export interface SearchLocationsVariables {
  query: string;
}

export interface GetActivityRankingsVariables {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

// =============================================================================
// QUERY RESPONSES
// =============================================================================

export interface SearchLocationsResponse {
  searchLocations: Location[];
}

export interface GetActivityRankingsResponse {
  getActivityRankings: LocationWeatherRanking;
}