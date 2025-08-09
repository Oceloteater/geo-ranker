export const ACTIVITIES = {
  SKIING: 'skiing',
  SURFING: 'surfing', 
  OUTDOOR_SIGHTSEEING: 'outdoor-sightseeing',
  INDOOR_SIGHTSEEING: 'indoor-sightseeing'
} as const;

export const ACTIVITY_LABELS = {
  [ACTIVITIES.SKIING]: 'Skiing',
  [ACTIVITIES.SURFING]: 'Surfing',
  [ACTIVITIES.OUTDOOR_SIGHTSEEING]: 'Outdoor Sightseeing', 
  [ACTIVITIES.INDOOR_SIGHTSEEING]: 'Indoor Sightseeing'
} as const;

export const WEATHER_PARAMETERS = {
  TEMPERATURE_MAX: 'temperature_2m_max',
  TEMPERATURE_MIN: 'temperature_2m_min',
  HUMIDITY: 'relative_humidity_2m_mean',
  WIND_SPEED: 'wind_speed_10m_max',
  WIND_DIRECTION: 'wind_direction_10m_dominant',
  PRECIPITATION: 'precipitation_sum',
  CLOUD_COVER: 'cloud_cover_mean',
  UV_INDEX: 'uv_index_max'
} as const;


export const SUITABILITY_SCORES = {
  EXCELLENT: 85,
  GOOD: 65,
  FAIR: 45,
  POOR: 25
} as const;

export const TEMPERATURE_RANGES = {
  SKIING: { ideal: [-5, 5], acceptable: [-15, 10] },
  SURFING: { ideal: [20, 30], acceptable: [15, 35] },
  OUTDOOR_SIGHTSEEING: { ideal: [15, 25], acceptable: [5, 30] },
  INDOOR_SIGHTSEEING: { ideal: [10, 30], acceptable: [-10, 40] }
} as const;