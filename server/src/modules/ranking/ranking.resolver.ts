import { Resolver, Query, Args, Float } from '@nestjs/graphql';
import { RankingService } from './ranking.service';
import { 
  LocationWeatherRankingType, 
  ActivityTypeEnum, 
  SuitabilityEnum 
} from './ranking.types';
import { ActivityType } from '../../types/shared.types';

@Resolver()
export class RankingResolver {
  constructor(private readonly rankingService: RankingService) {}

  @Query(() => LocationWeatherRankingType)
  async getActivityRankings(
    @Args('city') city: string,
    @Args('latitude', { type: () => Float }) latitude: number,
    @Args('longitude', { type: () => Float }) longitude: number,
    @Args('country') country: string,
  ): Promise<LocationWeatherRankingType> {
    const result = await this.rankingService.getActivityRankings(
      city,
      latitude,
      longitude,
      country,
    );

    // Convert service types to GraphQL types
    return {
      ...result,
      forecast: result.forecast.map(daily => ({
        ...daily,
        rankings: daily.rankings.map(ranking => ({
          ...ranking,
          activity: this.mapActivityType(ranking.activity),
          conditions: {
            ...ranking.conditions,
            suitability: this.mapSuitability(ranking.conditions.suitability),
          },
        })),
      })),
    };
  }

  private mapActivityType(activity: ActivityType): ActivityTypeEnum {
    const mapping: Record<ActivityType, ActivityTypeEnum> = {
      skiing: ActivityTypeEnum.SKIING,
      surfing: ActivityTypeEnum.SURFING,
      outdoor_sightseeing: ActivityTypeEnum.OUTDOOR_SIGHTSEEING,
      indoor_sightseeing: ActivityTypeEnum.INDOOR_SIGHTSEEING,
    };
    return mapping[activity];
  }

  private mapSuitability(suitability: 'excellent' | 'good' | 'fair' | 'poor'): SuitabilityEnum {
    const mapping = {
      excellent: SuitabilityEnum.EXCELLENT,
      good: SuitabilityEnum.GOOD,
      fair: SuitabilityEnum.FAIR,
      poor: SuitabilityEnum.POOR,
    };
    return mapping[suitability];
  }
}