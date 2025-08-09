import { ObjectType, Field, Float } from '@nestjs/graphql';

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