import { gql } from '@apollo/client';

// =============================================================================
// SEARCH LOCATIONS QUERY
// =============================================================================

export const SEARCH_LOCATIONS = gql`
  query SearchLocations($query: String!) {
    searchLocations(query: $query) {
      name
      country
      latitude
      longitude
      timezone
    }
  }
`;

// =============================================================================
// GET ACTIVITY RANKINGS QUERY
// =============================================================================

export const GET_ACTIVITY_RANKINGS = gql`
  query GetActivityRankings(
    $city: String!
    $country: String!
    $latitude: Float!
    $longitude: Float!
  ) {
    getActivityRankings(
      city: $city
      country: $country
      latitude: $latitude
      longitude: $longitude
    ) {
      city
      country
      latitude
      longitude
      forecast {
        date
        weather {
          date
          temperatureMax
          temperatureMin
          humidity
          windSpeed
          windDirection
          precipitation
          cloudCover
          uvIndex
        }
        rankings {
          activity
          score
          reason
          conditions {
            temperature
            weather
            suitability
          }
        }
      }
    }
  }
`;

// =============================================================================
// GET WEATHER FORECAST QUERY (Optional - for more granular control)
// =============================================================================

export const GET_WEATHER_FORECAST = gql`
  query GetWeatherForecast($latitude: Float!, $longitude: Float!) {
    getWeatherForecast(latitude: $latitude, longitude: $longitude) {
      date
      temperatureMax
      temperatureMin
      humidity
      windSpeed
      windDirection
      precipitation
      cloudCover
      uvIndex
    }
  }
`;

// =============================================================================
// GET MARINE FORECAST QUERY (Optional - for detailed marine data)
// =============================================================================

export const GET_MARINE_FORECAST = gql`
  query GetMarineForecast($latitude: Float!, $longitude: Float!) {
    getMarineForecast(latitude: $latitude, longitude: $longitude) {
      date
      averages {
        waveHeight
        waveDirection
        wavePeriod
        windWaveHeight
        windWavePeriod
        swellWaveHeight
        swellWaveDirection
        swellWavePeriod
      }
    }
  }
`;