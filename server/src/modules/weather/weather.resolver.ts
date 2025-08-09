import { Resolver, Query, Args, Float } from '@nestjs/graphql';
import { WeatherService } from './weather.service';
import { LocationType, DailyWeatherType } from './types/weather.types';
import { DailyMarineDataType } from './types/marine.types';

@Resolver()
export class WeatherResolver {
  constructor(private readonly weatherService: WeatherService) {}

  @Query(() => [LocationType])
  async searchLocations(
    @Args('query') query: string,
  ): Promise<LocationType[]> {
    const results = await this.weatherService.searchLocation(query);
    return results.map(result => ({
      name: result.name,
      country: result.country,
      latitude: result.latitude,
      longitude: result.longitude,
      timezone: result.timezone,
    }));
  }

  @Query(() => [DailyWeatherType])
  async getWeatherForecast(
    @Args('latitude', { type: () => Float }) latitude: number,
    @Args('longitude', { type: () => Float }) longitude: number,
  ): Promise<DailyWeatherType[]> {
    return this.weatherService.getWeatherForecast(latitude, longitude);
  }

  @Query(() => [DailyMarineDataType])
  async getMarineForecast(
    @Args('latitude', { type: () => Float }) latitude: number,
    @Args('longitude', { type: () => Float }) longitude: number,
  ): Promise<DailyMarineDataType[]> {
    return this.weatherService.getMarineForecast(latitude, longitude);
  }
}