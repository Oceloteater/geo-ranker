import { IActivityConfig } from '../common/types';

export const DEFAULT_ACTIVITY_CONFIG: IActivityConfig[] = [
  { id: 'skiing', enabled: true, priority: 1 },
  { id: 'surfing', enabled: true, priority: 2 },
  { id: 'outdoor-sightseeing', enabled: true, priority: 3 },
  { id: 'indoor-sightseeing', enabled: true, priority: 4 }
];

export const getActivityConfig = (): IActivityConfig[] => {
  // In the future, this could read from environment variables or a config file
  const configString = process.env.ACTIVITY_CONFIG;
  
  if (configString) {
    try {
      return JSON.parse(configString);
    } catch (error) {
      console.warn('Invalid ACTIVITY_CONFIG format, using defaults');
    }
  }
  
  return DEFAULT_ACTIVITY_CONFIG;
};