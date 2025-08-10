import { IActivityPlugin, IActivityScore, DataSource } from '../../../common/types';
import { IDailyWeatherData, IDailyMarineData } from '../../../common/types';

export class IndoorSightseeingPlugin implements IActivityPlugin {
  readonly id = 'indoor-sightseeing';
  readonly name = 'indoor-sightseeing';
  readonly displayName = 'Indoor Sightseeing';

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
    let score = 50; // Base score since weather matters less
    
    // Bad weather makes indoor activities more appealing
    if (weather.precipitation > 10) score += 25;
    else if (weather.precipitation > 5) score += 15;
    else score += 10;
    
    if (weather.cloudCover > 80) score += 10;
    else score += 5;
    
    if (avgTemp < 5 || avgTemp > 30) score += 15;
    else score += 10;
    
    return Math.min(100, score);
  }

  private getReason(weather: IDailyWeatherData, avgTemp: number): string {
    if (weather.precipitation > 10) {
      return 'Rainy weather - perfect for museums and indoor attractions';
    } else if (avgTemp < 5 || avgTemp > 30) {
      return 'Extreme temperatures make indoor activities appealing';
    } else {
      return 'Good weather for both indoor and outdoor activities';
    }
  }

  private getSuitability(score: number): 'excellent' | 'good' | 'fair' | 'poor' {
    if (score >= 80) return 'excellent';
    if (score >= 65) return 'good';
    if (score >= 50) return 'fair';
    return 'poor';
  }
}