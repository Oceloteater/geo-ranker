import { Module } from '@nestjs/common';
import { WeatherResolver } from './weather.resolver';
import { WeatherService } from './weather.service';
import { OpenMeteoService } from './open-meteo.service';

@Module({
  providers: [WeatherResolver, WeatherService, OpenMeteoService],
  exports: [WeatherService],
})
export class WeatherModule {}