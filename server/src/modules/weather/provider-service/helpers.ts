import { IDailyMarineData, IMarineApiResponse } from '../../../common/types';

export const groupMarineDataByDay = (hourly: IMarineApiResponse['hourly']): IDailyMarineData[] => {
    const dailyGroups = new Map<string, any[]>();

    // Group hourly data by date
    hourly.time.forEach((timestamp, index) => {
        const date = timestamp.split('T')[0]; // Extract date part (YYYY-MM-DD)

        if (!dailyGroups.has(date)) {
            dailyGroups.set(date, []);
        }

        dailyGroups.get(date)!.push({
            timestamp,
            waveHeight: hourly.wave_height[index] || 0,
            waveDirection: hourly.wave_direction[index] || 0,
            wavePeriod: hourly.wave_period[index] || 0,
            windWaveHeight: hourly.wind_wave_height[index] || 0,
            windWavePeriod: hourly.wind_wave_period[index] || 0,
            swellWaveHeight: hourly.swell_wave_height[index] || 0,
            swellWaveDirection: hourly.swell_wave_direction[index] || 0,
            swellWavePeriod: hourly.swell_wave_period[index] || 0,
        });
    });

    // Calculate daily averages
    return Array.from(dailyGroups.entries()).map(([date, hourlyData]) => ({
        date,
        hourly: hourlyData,
        averages: {
            waveHeight: average(hourlyData.map(d => d.waveHeight)),
            waveDirection: average(hourlyData.map(d => d.waveDirection)),
            wavePeriod: average(hourlyData.map(d => d.wavePeriod)),
            windWaveHeight: average(hourlyData.map(d => d.windWaveHeight)),
            windWavePeriod: average(hourlyData.map(d => d.windWavePeriod)),
            swellWaveHeight: average(hourlyData.map(d => d.swellWaveHeight)),
            swellWaveDirection: average(hourlyData.map(d => d.swellWaveDirection)),
            swellWavePeriod: average(hourlyData.map(d => d.swellWavePeriod)),
        },
    }));
}

const average = (numbers: number[]): number => {
    const validNumbers = numbers.filter(n => !isNaN(n) && n !== null);
    return validNumbers.length > 0 ? validNumbers.reduce((a, b) => a + b, 0) / validNumbers.length : 0;
}