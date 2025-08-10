import { IActivityPlugin, IActivityScore, DataSource } from '../../../common/types';
import { IDailyWeatherData, IDailyMarineData } from '../../../common/types';

export class HikingPlugin implements IActivityPlugin {
  readonly id = 'hiking';
  readonly name = 'hiking';
  readonly displayName = 'Hiking';

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
    
    // Temperature (mild to cool is ideal for hiking)
    if (avgTemp >= 10 && avgTemp <= 22) score += 35;
    else if (avgTemp >= 5 && avgTemp <= 28) score += 25;
    else score += 10;
    
    // Precipitation (dry conditions preferred)
    if (weather.precipitation < 0.5) score += 25;
    else if (weather.precipitation < 3) score += 15;
    else score += 5;
    
    // Cloud cover (partial clouds can be nice for hiking)
    if (weather.cloudCover >= 10 && weather.cloudCover <= 70) score += 20;
    else if (weather.cloudCover < 90) score += 15;
    else score += 5;
    
    // Wind (light to moderate wind is pleasant)
    if (weather.windSpeed < 20) score += 15;
    else if (weather.windSpeed < 30) score += 10;
    else score += 0;
    
    // UV Index (sun protection needed but some sun is nice)
    if (weather.uvIndex <= 7) score += 5;
    else score += 2;
    
    return Math.min(100, score);
  }

  private getReason(weather: IDailyWeatherData, avgTemp: number): string {
    if (weather.precipitation > 5) {
      return 'Heavy rain makes trail conditions challenging';
    } else if (avgTemp >= 10 && avgTemp <= 22 && weather.precipitation < 1) {
      return 'Perfect hiking weather with comfortable temperature and dry conditions';
    } else if (avgTemp > 28) {
      return 'Hot weather - start early and bring plenty of water';
    } else if (avgTemp < 5) {
      return 'Cold weather - dress warmly and check trail conditions';
    } else {
      return 'Good conditions for hiking with proper preparation';
    }
  }

  private getSuitability(score: number): 'excellent' | 'good' | 'fair' | 'poor' {
    if (score >= 80) return 'excellent';
    if (score >= 65) return 'good';
    if (score >= 50) return 'fair';
    return 'poor';
  }
}