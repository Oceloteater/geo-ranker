import { Module } from '@nestjs/common';
import { RankingResolver } from './ranking.resolver';
import { RankingService } from './ranking.service';
import { ActivityPluginRegistry } from './services/activity-plugin-registry.service';
import { WeatherModule } from '../weather/weather.module';

@Module({
  imports: [WeatherModule],
  providers: [RankingResolver, RankingService, ActivityPluginRegistry],
})
export class RankingModule {}