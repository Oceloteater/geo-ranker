import { ObjectType, Field, Float, Int, registerEnumType } from '@nestjs/graphql';

// =============================================================================
// GRAPHQL ENUMS
// =============================================================================

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

// Register enums for GraphQL
registerEnumType(ActivityTypeEnum, {
  name: 'ActivityType',
});

registerEnumType(SuitabilityEnum, {
  name: 'Suitability',
});

// =============================================================================
// GRAPHQL WEATHER TYPES
// =============================================================================

@ObjectType()
export class LocationType {
  @Field()
  name: string;

  @Field()
  country: string;

  @Field(() => Float)
  latitude: number;

  @Field(() => Float)
  longitude: number;

  @Field()
  timezone: string;
}

@ObjectType()
export class DailyWeatherType {
  @Field()
  date: string;

  @Field(() => Float)
  temperatureMax: number;

  @Field(() => Float)
  temperatureMin: number;

  @Field(() => Float)
  humidity: number;

  @Field(() => Float)
  windSpeed: number;

  @Field(() => Float)
  windDirection: number;

  @Field(() => Float)
  precipitation: number;

  @Field(() => Float)
  cloudCover: number;

  @Field(() => Float)
  uvIndex: number;
}

// =============================================================================
// GRAPHQL ACTIVITY RANKING TYPES
// =============================================================================

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

// =============================================================================
// GRAPHQL MARINE TYPES
// =============================================================================

@ObjectType()
export class MarineDataType {
  @Field()
  timestamp: string;

  @Field(() => Float)
  waveHeight: number;

  @Field(() => Float)
  waveDirection: number;

  @Field(() => Float)
  wavePeriod: number;

  @Field(() => Float)
  windWaveHeight: number;

  @Field(() => Float)
  windWavePeriod: number;

  @Field(() => Float)
  swellWaveHeight: number;

  @Field(() => Float)
  swellWaveDirection: number;

  @Field(() => Float)
  swellWavePeriod: number;
}

@ObjectType()
export class MarineAveragesType {
  @Field(() => Float)
  waveHeight: number;

  @Field(() => Float)
  waveDirection: number;

  @Field(() => Float)
  wavePeriod: number;

  @Field(() => Float)
  windWaveHeight: number;

  @Field(() => Float)
  windWavePeriod: number;

  @Field(() => Float)
  swellWaveHeight: number;

  @Field(() => Float)
  swellWaveDirection: number;

  @Field(() => Float)
  swellWavePeriod: number;
}

@ObjectType()
export class DailyMarineDataType {
  @Field()
  date: string;

  @Field(() => [MarineDataType])
  hourly: MarineDataType[];

  @Field(() => MarineAveragesType)
  averages: MarineAveragesType;
}