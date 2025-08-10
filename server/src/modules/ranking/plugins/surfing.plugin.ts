import { IActivityPlugin, IActivityScore, DataSource } from '../../../common/types';
import { IDailyWeatherData, IDailyMarineData } from '../../../common/types';

export class SurfingPlugin implements IActivityPlugin {
  readonly id = 'surfing';
  readonly name = 'surfing';
  readonly displayName = 'Surfing';

  getRequiredDataSources(): DataSource[] {
    return [DataSource.WEATHER, DataSource.MARINE];
  }

  scoreActivity(weather: IDailyWeatherData, marine?: IDailyMarineData): IActivityScore {
    // If no marine data available or all wave data is 0/null, surfing is not possible at this location
    if (!marine || marine.averages.waveHeight === null || marine.averages.waveHeight === undefined || marine.averages.waveHeight === 0) {
      return {
        score: 0,
        reason: 'No surfing conditions - location is not near suitable water bodies with wave data',
        suitability: 'poor'
      };
    }

    const avgTemp = (weather.temperatureMax + weather.temperatureMin) / 2;
    let score = this.calculateWeatherScore(weather, avgTemp);
    
    // Add marine data scoring
    score += this.calculateMarineScore(marine);
    
    const finalScore = Math.min(100, score);
    const suitability = this.getSuitability(finalScore);
    const reason = this.getReason(weather, avgTemp, marine, finalScore);

    return { score: finalScore, reason, suitability };
  }

  private calculateWeatherScore(weather: IDailyWeatherData, avgTemp: number): number {
    let score = 0;
    
    // Temperature (warm is good)
    if (avgTemp >= 20 && avgTemp <= 30) score += 30;
    else if (avgTemp >= 15 && avgTemp <= 35) score += 20;
    else score += 5;
    
    // Wind (moderate wind good for waves, but not too strong)
    if (weather.windSpeed >= 10 && weather.windSpeed <= 25) score += 25;
    else if (weather.windSpeed >= 5 && weather.windSpeed <= 35) score += 15;
    else score += 5;
    
    // Precipitation (less rain is better)
    if (weather.precipitation < 2) score += 20;
    else if (weather.precipitation < 5) score += 15;
    else score += 5;
    
    // Cloud cover (some sun is nice)
    if (weather.cloudCover < 50) score += 15;
    else if (weather.cloudCover < 80) score += 10;
    else score += 5;
    
    // UV Index (sun protection needed)
    if (weather.uvIndex <= 8) score += 10;
    else score += 5;
    
    return score;
  }

  private calculateMarineScore(marine: IDailyMarineData): number {
    let marineScore = 0;
    
    // Wave height (moderate waves are good for surfing)
    if (marine.averages.waveHeight >= 1 && marine.averages.waveHeight <= 3) marineScore += 20;
    else if (marine.averages.waveHeight >= 0.5 && marine.averages.waveHeight <= 4) marineScore += 15;
    else marineScore += 5;
    
    // Wave period (longer periods generally better)
    if (marine.averages.wavePeriod >= 8) marineScore += 15;
    else if (marine.averages.wavePeriod >= 6) marineScore += 10;
    else marineScore += 5;
    
    return marineScore;
  }

  private getReason(weather: IDailyWeatherData, avgTemp: number, marine?: IDailyMarineData, score?: number): string {
    // For excellent scores, always give positive messaging
    if (score && score >= 80) {
      if (marine && marine.averages.waveHeight >= 1) {
        return `Excellent surfing conditions with ${marine.averages.waveHeight.toFixed(1)}m waves`;
      }
      return 'Excellent weather conditions for surfing';
    }
    
    // For good scores, focus on positives but mention any concerns
    if (score && score >= 65) {
      if (marine && marine.averages.waveHeight >= 1 && marine.averages.waveHeight <= 3 && avgTemp >= 20) {
        return `Good waves (${marine.averages.waveHeight.toFixed(1)}m) and warm temperature for surfing`;
      } else if (weather.windSpeed >= 10 && weather.windSpeed <= 25 && avgTemp >= 20) {
        return 'Good wind and warm temperature for surfing';
      } else if (avgTemp < 15) {
        return 'Good wave conditions but water temperature may be cold';
      }
      return 'Good conditions for surfing';
    }
    
    // For lower scores, be more specific about limitations
    if (avgTemp < 15) {
      return 'Water temperature may be too cold for surfing';
    } else if (marine && marine.averages.waveHeight < 0.5) {
      return 'Wave conditions too calm for good surfing';
    } else {
      return 'Moderate conditions for surfing';
    }
  }

  private getSuitability(score: number): 'excellent' | 'good' | 'fair' | 'poor' {
    if (score >= 80) return 'excellent';
    if (score >= 65) return 'good';
    if (score >= 50) return 'fair';
    return 'poor';
  }
}