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
- **Frontend**: React with TypeScript and Apollo Client
- **Weather Data**: Open-Meteo API (free, no API key required)
- **Architecture**: TypeScript monorepo with plugin-based activity system
- **Deployment**: Docker with multi-stage builds and Docker Compose

## Quick Start

### 🐳 Docker (Recommended)

The easiest way to run the full stack application:

```bash
# Clone the repository
git clone https://github.com/oceloteater/geo-ranker.git
cd geo-ranker

# Start everything with Docker Compose
docker compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:4000
# GraphQL Playground: http://localhost:4000/graphql
```

That's it! The application will be running with both frontend and backend containers.

#### Docker Commands

```bash
# Start in background
docker compose up -d

# View logs
docker compose logs -f

# Stop containers
docker compose down

# Rebuild containers
docker compose up --build

# Clean up everything
docker compose down --volumes --rmi all
```

### 💻 Local Development

For development without Docker:

```bash
# Install dependencies for both client and server
npm install

# Terminal 1: Start backend server
cd server
npm install
npm run start:dev

# Terminal 2: Start frontend client  
cd client
npm install
npm start

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

## Future Enhancements

- Config-driven scoring system
- User preference profiles
- Historical weather data analysis
- Machine learning-based activity recommendations
- Mobile app integration
- Real-time weather alerts