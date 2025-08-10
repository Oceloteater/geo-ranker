# Geo-Ranker

A weather-based activity ranking system built as an interview project. It accepts a city/town input and returns a 7-day ranking of how desirable it will be for various outdoor activities based on weather data from Open-Meteo API.

## Overview

**geo-ranker** evaluates weather conditions and ranks the following activities:
- Skiing
- Surfing
- Outdoor sightseeing
- Indoor sightseeing

The system uses a plugin-based architecture that makes it easy to add new activities or customize existing scoring algorithms.

## Tech Stack

- **Backend**: Node.js with NestJS and GraphQL
- **Frontend**: React (planned)
- **Weather Data**: Open-Meteo API
- **Architecture**: TypeScript monorepo with plugin-based activity system

## Quick Start

### Development Commands

```bash
# Install dependencies
npm install

# Start backend development server
npm run dev:server

# Build the project
npm run build

# Health check
curl http://localhost:4000/health

# GraphQL Playground
http://localhost:4000/graphql
```

## Architecture

### Plugin-Based Activity System

The system uses an extensible plugin architecture where each activity is a self-contained plugin implementing the `IActivityPlugin` interface:

```typescript
interface IActivityPlugin {
  readonly id: string;
  readonly name: string;
  readonly displayName: string;
  
  scoreActivity(weather: IDailyWeatherData, marine?: IDailyMarineData): IActivityScore;
  getRequiredDataSources(): DataSource[];
}
```

#### Adding New Activities

1. Create a new plugin class implementing `IActivityPlugin`
2. Add scoring logic specific to your activity
3. Register the plugin in the activity configuration
4. Enable it via environment variables or config files

### Scoring System Architecture

**Important Design Note**: The current scoring system has hardcoded values, but in a production application this would be entirely config-driven.

#### Current Implementation vs. Ideal Design

**Current (Hardcoded):**
```typescript
// Fixed values in code
if (avgTemp >= -5 && avgTemp <= 5) score += 40;
```

**Ideal (Config-Driven):**
```typescript
// Values from configuration
if (avgTemp >= config.skiing.temperature.ideal.min && 
    avgTemp <= config.skiing.temperature.ideal.max) {
  score += config.skiing.temperature.ideal.points;
}
```

#### Why Config-Driven Matters

- **Subjectivity**: What is "cold" or "hot" is a matter of opinion and location
- **Customization**: Different users/regions have different preferences
- **Flexibility**: Easy A/B testing of different scoring algorithms
- **Maintenance**: No code changes needed to adjust scoring parameters

#### Future Configuration Structure

```json
{
  "activities": {
    "skiing": {
      "temperature": {
        "ideal": { "min": -5, "max": 5, "points": 40 },
        "acceptable": { "min": -15, "max": 10, "points": 25 }
      },
      "precipitation": {
        "light": { "max": 2, "points": 20 },
        "moderate": { "max": 10, "points": 10 }
      }
    }
  }
}
```

This would allow the same scoring engine to work for different climates, user preferences, and use cases without code modifications.

## Project Structure

```
/server                 # NestJS backend
  /src
    /common
      /types             # Centralized TypeScript interfaces
      /graphql           # GraphQL type definitions
      /utils             # Shared utilities
    /modules
      /ranking           # Activity ranking logic
        /plugins         # Individual activity plugins
        /services        # Plugin registry and orchestration
      /weather           # Weather data fetching
    /config              # Configuration management
/client                 # React frontend (planned)
```

## API Usage

### GraphQL Queries

```graphql
# Get activity rankings for a location
query GetActivityRankings($city: String!, $country: String!, $latitude: Float!, $longitude: Float!) {
  getActivityRankings(city: $city, country: $country, latitude: $latitude, longitude: $longitude) {
    city
    country
    forecast {
      date
      rankings {
        activity
        score
        reason
        conditions {
          temperature
          weather
          suitability
        }
      }
    }
  }
}

# Search for locations
query SearchLocations($query: String!) {
  searchLocations(query: $query) {
    name
    country
    latitude
    longitude
  }
}
```

## Environment Variables

```env
# Open-Meteo API URLs
OPEN_METEO_BASE_URL=https://api.open-meteo.com/v1
OPEN_METEO_LOCALE_URL=https://geocoding-api.open-meteo.com/v1
OPEN_METEO_MARINE_URL=https://marine-api.open-meteo.com/v1

# Activity Configuration (JSON)
ACTIVITY_CONFIG='[{"id":"skiing","enabled":true,"priority":1}]'
```

## Development Notes

This project was built with a focus on:
- **Clean architecture** with clear separation of concerns
- **Extensibility** through plugin-based design
- **Type safety** with comprehensive TypeScript interfaces
- **Maintainability** over feature completeness
- **Code quality** and best practices

Time constraint: 2-3 hours focus on architecture over features.

## Future Enhancements

- Config-driven scoring system
- User preference profiles
- Historical weather data analysis
- Machine learning-based activity recommendations
- Mobile app integration
- Real-time weather alerts