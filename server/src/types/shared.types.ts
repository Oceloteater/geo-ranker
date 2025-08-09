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

export type ActivityType = 'skiing' | 'surfing' | 'outdoor_sightseeing' | 'indoor_sightseeing';

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
    relative_humidity_2m: number[];
    wind_speed_10m: number[];
    wind_direction_10m: number[];
    precipitation_sum: number[];
    cloud_cover: number[];
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