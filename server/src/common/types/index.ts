// =============================================================================
// COMMON TYPES, INTERFACES, AND ENUMS
// =============================================================================

// =============================================================================
// ENUMS
// =============================================================================

export enum DataSource {
  WEATHER = 'weather',
  MARINE = 'marine'
}

export enum SuitabilityLevel {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor'
}

// =============================================================================
// BASIC TYPES
// =============================================================================

export type ActivityType = 'skiing' | 'surfing' | 'outdoor-sightseeing' | 'indoor-sightseeing';

export type SuitabilityType = 'excellent' | 'good' | 'fair' | 'poor';

// =============================================================================
// WEATHER INTERFACES
// =============================================================================

export interface IWeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  precipitation: number;
  cloudCover: number;
  visibility: number;
  uvIndex: number;
  timestamp: string;
}

export interface IDailyWeatherData {
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
// MARINE INTERFACES
// =============================================================================

export interface IMarineData {
  timestamp: string;
  waveHeight: number;
  waveDirection: number;
  wavePeriod: number;
  windWaveHeight: number;
  windWavePeriod: number;
  swellWaveHeight: number;
  swellWaveDirection: number;
  swellWavePeriod: number;
}

export interface IDailyMarineData {
  date: string;
  hourly: IMarineData[];
  averages: {
    waveHeight: number;
    waveDirection: number;
    wavePeriod: number;
    windWaveHeight: number;
    windWavePeriod: number;
    swellWaveHeight: number;
    swellWaveDirection: number;
    swellWavePeriod: number;
  };
}

// =============================================================================
// GEOCODING INTERFACES
// =============================================================================

export interface IGeocodingResult {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

// =============================================================================
// ACTIVITY PLUGIN INTERFACES
// =============================================================================

export interface IActivityScore {
  score: number;
  reason: string;
  suitability: SuitabilityType;
}

export interface IActivityPlugin {
  readonly id: string;
  readonly name: string;
  readonly displayName: string;
  
  scoreActivity(
    weather: IDailyWeatherData, 
    marine?: IDailyMarineData
  ): IActivityScore;
  
  getRequiredDataSources(): DataSource[];
}

// =============================================================================
// ACTIVITY RANKING INTERFACES
// =============================================================================

export interface IActivityConditions {
  temperature: string;
  weather: string;
  suitability: SuitabilityType;
}

export interface IActivityRanking {
  activity: ActivityType;
  score: number;
  reason: string;
  conditions: IActivityConditions;
}

export interface IDailyRanking {
  date: string;
  weather: IDailyWeatherData;
  rankings: IActivityRanking[];
}

export interface ILocationWeatherRanking {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  forecast: IDailyRanking[];
}

// =============================================================================
// CONFIGURATION INTERFACES
// =============================================================================

export interface IActivityConfig {
  id: string;
  enabled: boolean;
  priority?: number;
}

// =============================================================================
// API RESPONSE INTERFACES
// =============================================================================

export interface IWeatherApiResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    relative_humidity_2m_mean: number[];
    wind_speed_10m_max: number[];
    wind_direction_10m_dominant: number[];
    precipitation_sum: number[];
    cloud_cover_mean: number[];
    uv_index_max: number[];
  };
}

export interface IGeocodingApiResponse {
  results?: Array<{
    name: string;
    country: string;
    latitude: number;
    longitude: number;
    timezone: string;
  }>;
}

export interface IMarineApiResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  hourly: {
    time: string[];
    wave_height: number[];
    wave_direction: number[];
    wave_period: number[];
    wind_wave_height: number[];
    wind_wave_period: number[];
    swell_wave_height: number[];
    swell_wave_direction: number[];
    swell_wave_period: number[];
  };
}