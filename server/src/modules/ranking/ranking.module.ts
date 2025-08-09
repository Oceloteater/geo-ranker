import { Module } from '@nestjs/common';
import { RankingResolver } from './ranking.resolver';
import { RankingService } from './ranking.service';
import { WeatherModule } from '../weather/weather.module';

@Module({
  imports: [WeatherModule],
  providers: [RankingResolver, RankingService],
})
export class RankingModule {}