import { ObjectType, Field, Float, Int, registerEnumType } from '@nestjs/graphql';
import { DailyWeatherType } from '../../weather/types/weather.types';

export enum ActivityTypeEnum {
  SKIING = 'skiing',
  SURFING = 'surfing',
  OUTDOOR_SIGHTSEEING = 'outdoor-sightseeing',
  INDOOR_SIGHTSEEING = 'indoor-sightseeing',
}

export enum SuitabilityEnum {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
}

registerEnumType(ActivityTypeEnum, {
  name: 'ActivityType',
});

registerEnumType(SuitabilityEnum, {
  name: 'Suitability',
});

@ObjectType()
export class ActivityConditionsType {
  @Field()
  temperature: string;

  @Field()
  weather: string;

  @Field(() => SuitabilityEnum)
  suitability: SuitabilityEnum;
}

@ObjectType()
export class ActivityRankingType {
  @Field(() => ActivityTypeEnum)
  activity: ActivityTypeEnum;

  @Field(() => Int)
  score: number;

  @Field()
  reason: string;

  @Field(() => ActivityConditionsType)
  conditions: ActivityConditionsType;
}

@ObjectType()
export class DailyRankingType {
  @Field()
  date: string;

  @Field(() => DailyWeatherType)
  weather: DailyWeatherType;

  @Field(() => [ActivityRankingType])
  rankings: ActivityRankingType[];
}

@ObjectType()
export class LocationWeatherRankingType {
  @Field()
  city: string;

  @Field()
  country: string;

  @Field(() => Float)
  latitude: number;

  @Field(() => Float)
  longitude: number;

  @Field(() => [DailyRankingType])
  forecast: DailyRankingType[];
}