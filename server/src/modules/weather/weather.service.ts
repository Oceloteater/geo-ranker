import { Injectable } from '@nestjs/common';
import { OpenMeteoService } from './provider-service/open-meteo.service';
import { IDailyWeatherData, IGeocodingResult, IDailyMarineData } from '../../common/types';

@Injectable()
export class WeatherService {
  constructor(private readonly openMeteoService: OpenMeteoService) {}

  async searchLocation(query: string): Promise<IGeocodingResult[]> {
    return this.openMeteoService.searchLocation(query);
  }

  async getWeatherForecast(
    latitude: number,
    longitude: number,
  ): Promise<IDailyWeatherData[]> {
    return this.openMeteoService.getWeatherForecast(latitude, longitude);
  }

  async getMarineForecast(
    latitude: number,
    longitude: number,
  ): Promise<IDailyMarineData[]> {
    return this.openMeteoService.getMarineForecast(latitude, longitude);
  }
}