import { ObjectType, Field, Float } from '@nestjs/graphql';

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