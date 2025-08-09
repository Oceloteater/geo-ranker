import { Injectable } from '@nestjs/common';
import { WeatherService } from '../weather/weather.service';
import { DailyWeatherData, ActivityType } from '../../types/shared.types';
import { ACTIVITIES, SUITABILITY_SCORES } from '../../constants/shared.constants';
import { 
  ActivityRanking,
  DailyRanking,
  LocationWeatherRanking
} from '../../common/interfaces/ranking.interface';
import { 
  calculateSkiingScore,
  calculateSurfingScore,
  calculateOutdoorSightseeingScore,
  calculateIndoorSightseeingScore,
  getSkiingReason,
  getSurfingReason,
  getOutdoorSightseeingReason,
  getIndoorSightseeingReason,
  getWeatherDescription
} from './helpers';

@Injectable()
export class RankingService {
  constructor(private readonly weatherService: WeatherService) {}

  async getActivityRankings(
    city: string,
    country: string,
    latitude: number,
    longitude: number,
  ): Promise<LocationWeatherRanking> {
    const weatherForecast = await this.weatherService.getWeatherForecast(
      latitude,
      longitude,
    );

    const forecast: DailyRanking[] = weatherForecast.map((dailyWeather) => ({
      date: dailyWeather.date,
      weather: dailyWeather,
      rankings: this.calculateActivityRankings(dailyWeather),
    }));

    return {
      city,
      country,
      latitude,
      longitude,
      forecast,
    };
  }

  private calculateActivityRankings(weather: DailyWeatherData): ActivityRanking[] {
    const activities: ActivityType[] = [
      ACTIVITIES.SKIING,
      ACTIVITIES.SURFING,
      ACTIVITIES.OUTDOOR_SIGHTSEEING,
      ACTIVITIES.INDOOR_SIGHTSEEING,
    ];
    return activities
      .map((activity) => this.rankActivity(activity, weather))
      .sort((a, b) => b.score - a.score);
  }

  private rankActivity = (activity: ActivityType, weather: DailyWeatherData): ActivityRanking => {
    const avgTemp = (weather.temperatureMax + weather.temperatureMin) / 2;
    
    let score = 0;
    let reason = '';
    let suitability: 'excellent' | 'good' | 'fair' | 'poor' = 'poor';

    switch (activity) {
      case ACTIVITIES.SKIING:
        score = calculateSkiingScore(weather, avgTemp);
        reason = getSkiingReason(weather, avgTemp);
        break;
      
      case ACTIVITIES.SURFING:
        score = calculateSurfingScore(weather, avgTemp);
        reason = getSurfingReason(weather, avgTemp);
        break;
      
      case ACTIVITIES.OUTDOOR_SIGHTSEEING:
        score = calculateOutdoorSightseeingScore(weather, avgTemp);
        reason = getOutdoorSightseeingReason(weather, avgTemp);
        break;
      
      case ACTIVITIES.INDOOR_SIGHTSEEING:
        score = calculateIndoorSightseeingScore(weather, avgTemp);
        reason = getIndoorSightseeingReason(weather, avgTemp);
        break;

      default: {
        console.warn(`Could not find handlers for activity: ${activity} please add to ranking engine.`);
      }
    }

    if (score >= SUITABILITY_SCORES.EXCELLENT) suitability = 'excellent';
    else if (score >= SUITABILITY_SCORES.GOOD) suitability = 'good';
    else if (score >= SUITABILITY_SCORES.FAIR) suitability = 'fair';
    else suitability = 'poor';

    return {
      activity,
      score,
      reason,
      conditions: {
        temperature: `${weather.temperatureMin}°C - ${weather.temperatureMax}°C`,
        weather: getWeatherDescription(weather),
        suitability,
      },
    };
  }
}