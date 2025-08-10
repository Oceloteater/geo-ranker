import { IActivityPlugin, IActivityScore, DataSource } from '../../../common/types';
import { IDailyWeatherData, IDailyMarineData } from '../../../common/types';

export class SkiingPlugin implements IActivityPlugin {
  readonly id = 'skiing';
  readonly name = 'skiing';
  readonly displayName = 'Skiing';

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
    
    // Temperature scoring (cold is good for skiing)
    if (avgTemp >= -5 && avgTemp <= 5) score += 40;
    else if (avgTemp >= -15 && avgTemp <= 10) score += 25;
    else score += 5;
    
    // Precipitation (some snow is good, too much rain is bad)
    if (weather.precipitation < 2) score += 20;
    else if (weather.precipitation < 10) score += 10;
    else score += 0;
    
    // Cloud cover (some clouds ok for skiing)
    if (weather.cloudCover < 70) score += 15;
    else score += 10;
    
    // Wind (moderate wind ok)
    if (weather.windSpeed < 20) score += 15;
    else if (weather.windSpeed < 30) score += 10;
    else score += 0;
    
    // UV Index (higher at altitude, some protection needed)
    if (weather.uvIndex <= 7) score += 10;
    else score += 5;
    
    return Math.min(100, score);
  }

  private getReason(weather: IDailyWeatherData, avgTemp: number): string {
    if (avgTemp >= -5 && avgTemp <= 5) {
      return 'Perfect skiing temperature with good snow conditions';
    } else if (avgTemp > 5) {
      return 'Too warm - snow may be slushy or melting';
    } else {
      return 'Very cold - bundle up but good for powder';
    }
  }

  private getSuitability(score: number): 'excellent' | 'good' | 'fair' | 'poor' {
    if (score >= 80) return 'excellent';
    if (score >= 65) return 'good';
    if (score >= 50) return 'fair';
    return 'poor';
  }
}