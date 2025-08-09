import { Injectable } from '@nestjs/common';
import { OpenMeteoService } from './open-meteo.service';
import { DailyWeatherData, GeocodingResult } from '../../types/shared.types';

@Injectable()
export class WeatherService {
  constructor(private readonly openMeteoService: OpenMeteoService) {}

  async searchLocation(query: string): Promise<GeocodingResult[]> {
    return this.openMeteoService.searchLocation(query);
  }

  async getWeatherForecast(
    latitude: number,
    longitude: number,
  ): Promise<DailyWeatherData[]> {
    return this.openMeteoService.getWeatherForecast(latitude, longitude);
  }
}