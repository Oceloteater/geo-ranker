import { IActivityPlugin, IActivityScore, DataSource } from '../../../common/types';
import { IDailyWeatherData, IDailyMarineData } from '../../../common/types';

export class OutdoorSightseeingPlugin implements IActivityPlugin {
  readonly id = 'outdoor-sightseeing';
  readonly name = 'outdoor-sightseeing';
  readonly displayName = 'Outdoor Sightseeing';

  getRequiredDataSources(): DataSource[] {
    return [DataSource.WEATHER];
  }

  scoreActivity(weather: IDailyWeatherData, marine?: IDailyMarineData): IActivityScore {
    const avgTemp = (weather.temperatureMax + weather.temperatureMin) / 2;
    const score = this.calculateScore(weather, avgTemp);
    const reason = this.getReason(weather, avgTemp);
    const suitability = this.getSuitability(score);

    return { score, reason, suitability };
  }

  private calculateScore(weather: IDailyWeatherData, avgTemp: number): number {
    let score = 0;
    
    // Temperature (mild is best)
    if (avgTemp >= 15 && avgTemp <= 25) score += 35;
    else if (avgTemp >= 5 && avgTemp <= 30) score += 25;
    else score += 10;
    
    // Precipitation (dry is best)
    if (weather.precipitation < 1) score += 25;
    else if (weather.precipitation < 5) score += 15;
    else score += 5;
    
    // Cloud cover (mix of sun and clouds ideal)
    if (weather.cloudCover >= 20 && weather.cloudCover <= 60) score += 20;
    else if (weather.cloudCover < 80) score += 15;
    else score += 5;
    
    // Wind (light wind pleasant)
    if (weather.windSpeed < 15) score += 15;
    else if (weather.windSpeed < 25) score += 10;
    else score += 0;
    
    // UV Index (moderate sun exposure)
    if (weather.uvIndex <= 6) score += 5;
    else score += 3;
    
    return Math.min(100, score);
  }

  private getReason(weather: IDailyWeatherData, avgTemp: number): string {
    if (weather.precipitation > 5) {
      return 'Rain may limit outdoor activities';
    } else if (avgTemp >= 15 && avgTemp <= 25 && weather.precipitation < 2) {
      return 'Perfect weather for walking and outdoor exploration';
    } else {
      return 'Decent weather for outdoor activities';
    }
  }

  private getSuitability(score: number): 'excellent' | 'good' | 'fair' | 'poor' {
    if (score >= 80) return 'excellent';
    if (score >= 65) return 'good';
    if (score >= 50) return 'fair';
    return 'poor';
  }
}