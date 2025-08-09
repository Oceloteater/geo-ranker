import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { DailyWeatherData, GeocodingResult, WeatherApiResponse, GeocodingApiResponse } from '../../types/shared.types';
import { WEATHER_PARAMETERS } from '../../constants/shared.constants';

@Injectable()
export class OpenMeteoService {
  private readonly baseUrl = process.env.OPEN_METEO_BASE_URL || 'https://api.open-meteo.com/v1';

  async searchLocation(query: string): Promise<GeocodingResult[]> {
    try {
      const geocodingUrl = process.env.OPEN_METEO_LOCALE_URL + '/search';
      const response = await axios.get<GeocodingApiResponse>(
        geocodingUrl,
        {
          params: {
            name: query,
            count: 5,
            language: 'en',
            format: 'json',
          },
        },
      );
      return response.data.results || [];
    } catch (error) {
      throw new HttpException(
        'Failed to search locations',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getWeatherForecast(
    latitude: number,
    longitude: number,
  ): Promise<DailyWeatherData[]> {
    console.log('URL:', `${this.baseUrl}/forecast`);
    try {
      const response = await axios.get<WeatherApiResponse>(
        `${this.baseUrl}/forecast`,
        {
          params: {
            latitude,
            longitude,
            daily: [
              WEATHER_PARAMETERS.TEMPERATURE_MAX,
              WEATHER_PARAMETERS.TEMPERATURE_MIN,
              WEATHER_PARAMETERS.HUMIDITY,
              WEATHER_PARAMETERS.WIND_SPEED,
              WEATHER_PARAMETERS.WIND_DIRECTION,
              WEATHER_PARAMETERS.PRECIPITATION,
              WEATHER_PARAMETERS.CLOUD_COVER,
              WEATHER_PARAMETERS.UV_INDEX,
            ].join(','),
            timezone: 'auto',
            forecast_days: 7,
          },
        },
      );
      const { daily } = response.data;
      console.log('DATA:', response.data);

      return daily.time.map((date, index) => ({
        date,
        temperatureMax: daily.temperature_2m_max[index],
        temperatureMin: daily.temperature_2m_min[index],
        humidity: daily.relative_humidity_2m_mean[index],
        windSpeed: daily.wind_speed_10m_max[index],
        windDirection: daily.wind_direction_10m_dominant[index],
        precipitation: daily.precipitation_sum[index],
        cloudCover: daily.cloud_cover_mean[index],
        uvIndex: daily.uv_index_max[index],
      }));
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Failed to fetch weather forecast',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}