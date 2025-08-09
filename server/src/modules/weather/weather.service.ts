import { Injectable } from '@nestjs/common';
import { OpenMeteoService } from './provider-service/open-meteo.service';
import { DailyWeatherData, GeocodingResult, DailyMarineData } from '../../types/shared.types';

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

  async getMarineForecast(
    latitude: number,
    longitude: number,
  ): Promise<DailyMarineData[]> {
    return this.openMeteoService.getMarineForecast(latitude, longitude);
  }
}