import { Injectable, OnModuleInit } from '@nestjs/common';
import { WeatherService } from '../weather/weather.service';
import { 
  IDailyWeatherData,
  ActivityType,
  IDailyMarineData,
  IActivityRanking,
  IDailyRanking,
  ILocationWeatherRanking,
  DataSource
} from '../../common/types';
import { ActivityPluginRegistry } from './services/activity-plugin-registry.service';
import { getWeatherDescription } from './helpers';
import { 
  SkiingPlugin,
  SurfingPlugin, 
  OutdoorSightseeingPlugin,
  IndoorSightseeingPlugin
} from './plugins';
import { getActivityConfig } from '../../config/activities.config';

@Injectable()
export class RankingService implements OnModuleInit {
  constructor(
    private readonly weatherService: WeatherService,
    private readonly pluginRegistry: ActivityPluginRegistry
  ) {}

  onModuleInit() {
    // Map of available plugins
    const availablePlugins = {
      'skiing': SkiingPlugin,
      'surfing': SurfingPlugin,
      'outdoor-sightseeing': OutdoorSightseeingPlugin,
      'indoor-sightseeing': IndoorSightseeingPlugin
    };

    // Register plugins based on configuration
    const config = getActivityConfig();
    config
      .filter(activityConfig => activityConfig.enabled)
      .forEach(activityConfig => {
        const PluginClass = availablePlugins[activityConfig.id];
        if (PluginClass) {
          this.pluginRegistry.register(new PluginClass());
        } else {
          console.warn(`Plugin not found for activity: ${activityConfig.id}`);
        }
      });
  }

  async getActivityRankings(
    city: string,
    country: string,
    latitude: number,
    longitude: number,
  ): Promise<ILocationWeatherRanking> {
    const weatherForecast = await this.weatherService.getWeatherForecast(
      latitude,
      longitude,
    );

    // Get marine data if any plugins require it
    let marineForecast: IDailyMarineData[] | undefined;
    const needsMarineData = this.pluginRegistry.getAllPlugins()
      .some(plugin => plugin.getRequiredDataSources().includes(DataSource.MARINE));
    
    if (needsMarineData) {
      try {
        marineForecast = await this.weatherService.getMarineForecast(latitude, longitude);
      } catch (error) {
        console.warn('Marine data not available for this location');
      }
    }

    const forecast: IDailyRanking[] = weatherForecast.map((dailyWeather, index) => ({
      date: dailyWeather.date,
      weather: dailyWeather,
      rankings: this.calculateActivityRankings(dailyWeather, marineForecast?.[index]),
    }));

    return {
      city,
      country,
      latitude,
      longitude,
      forecast,
    };
  }

  getAvailableActivities(): string[] {
    return this.pluginRegistry.getPluginIds();
  }

  getActivityCount(): number {
    return this.pluginRegistry.getPluginCount();
  }

  private calculateActivityRankings(weather: IDailyWeatherData, marine?: IDailyMarineData): IActivityRanking[] {
    const plugins = this.pluginRegistry.getAllPlugins();
    return plugins
      .map((plugin) => this.rankActivity(plugin.id as ActivityType, weather, marine))
      .sort((a, b) => b.score - a.score);
  }

  private rankActivity = (activityId: ActivityType, weather: IDailyWeatherData, marine?: IDailyMarineData): IActivityRanking => {
    try {
      const plugin = this.pluginRegistry.getPlugin(activityId);
      const result = plugin.scoreActivity(weather, marine);
      
      return {
        activity: activityId,
        score: result.score,
        reason: result.reason,
        conditions: {
          temperature: `${weather.temperatureMin}°C - ${weather.temperatureMax}°C`,
          weather: getWeatherDescription(weather),
          suitability: result.suitability,
        },
      };
    } catch (error) {
      console.warn(`Could not find plugin for activity: ${activityId}`);
      return {
        activity: activityId,
        score: 0,
        reason: 'Activity plugin not available',
        conditions: {
          temperature: `${weather.temperatureMin}°C - ${weather.temperatureMax}°C`,
          weather: getWeatherDescription(weather),
          suitability: 'poor',
        },
      };
    }
  }
}