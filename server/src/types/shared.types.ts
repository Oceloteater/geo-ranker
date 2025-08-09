export interface WeatherData {
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

export interface DailyWeatherData {
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

export type ActivityType = 'skiing' | 'surfing' | 'outdoor-sightseeing' | 'indoor-sightseeing';

export interface GeocodingResult {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface WeatherApiResponse {
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

export interface GeocodingApiResponse {
  results?: Array<{
    name: string;
    country: string;
    latitude: number;
    longitude: number;
    timezone: string;
  }>;
}

export interface MarineData {
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

export interface DailyMarineData {
  date: string;
  hourly: MarineData[];
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

export interface MarineApiResponse {
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