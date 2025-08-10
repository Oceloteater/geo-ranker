import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { groupMarineDataByDay } from './helpers';
import { 
  IDailyWeatherData, 
  IGeocodingResult, 
  IWeatherApiResponse, 
  IGeocodingApiResponse,
  IDailyMarineData,
  IMarineApiResponse 
} from '../../../common/types';
import { WEATHER_PARAMETERS, MARINE_PARAMETERS } from '../../../constants/shared.constants';

@Injectable()
export class OpenMeteoService {
  private readonly baseUrl = process.env.OPEN_METEO_BASE_URL || 'https://api.open-meteo.com/v1';
  private readonly geocodingUrl = process.env.OPEN_METEO_LOCALE_URL || 'https://geocoding-api.open-meteo.com/v1';
  private readonly marineUrl = process.env.OPEN_METEO_MARINE_URL || 'https://marine-api.open-meteo.com/v1';

  async searchLocation(query: string): Promise<IGeocodingResult[]> {
    try {
      const response = await axios.get<IGeocodingApiResponse>(
        `${this.geocodingUrl}/search`,
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
  ): Promise<IDailyWeatherData[]> {
    console.log('URL:', `${this.baseUrl}/forecast`);
    try {
      const response = await axios.get<IWeatherApiResponse>(
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
      console.log('DATA:', response.data);
      const { daily } = response.data;

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
      console.error('Weather forecast error:', error);
      throw new HttpException(
        'Failed to fetch weather forecast, please try again shortly',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getMarineForecast(
    latitude: number,
    longitude: number,
  ): Promise<IDailyMarineData[]> {
    console.log('URL:', `${this.marineUrl}/marine`);
    try {
      const response = await axios.get<IMarineApiResponse>(
        `${this.marineUrl}/marine`,
        {
          params: {
            latitude,
            longitude,
            hourly: [
              MARINE_PARAMETERS.WAVE_HEIGHT,
              MARINE_PARAMETERS.WAVE_DIRECTION,
              MARINE_PARAMETERS.WAVE_PERIOD,
              MARINE_PARAMETERS.WIND_WAVE_HEIGHT,
              MARINE_PARAMETERS.WIND_WAVE_PERIOD,
              MARINE_PARAMETERS.SWELL_WAVE_HEIGHT,
              MARINE_PARAMETERS.SWELL_WAVE_DIRECTION,
              MARINE_PARAMETERS.SWELL_WAVE_PERIOD,
            ].join(','),
            forecast_days: 7,
          },
        },
      );
      console.log('Marine DATA:', response.data);
      const { hourly } = response.data;

      // Group hourly data by day and calculate daily averages
      return groupMarineDataByDay(hourly);
    } catch (error) {
      console.error('Marine forecast error:', error);
      throw new HttpException(
        'Failed to fetch marine forecast, please try again shortly',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}