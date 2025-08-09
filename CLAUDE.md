# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**geo-ranker** is a weather-based activity ranking system built as an interview project. It accepts a city/town input and returns a 7-day ranking of how desirable it will be for various outdoor activities based on weather data from Open-Meteo API.

## Activities to Rank
- Skiing
- Surfing 
- Outdoor sightseeing
- Indoor sightseeing

## Tech Stack Requirements
- **Backend**: Node.js with GraphQL
- **Frontend**: React
- **Weather Data**: Open-Meteo API
- **Time Constraint**: 2-3 hours focus on architecture over features

## Planned Architecture

### Backend (`/server`)
- GraphQL API with resolvers for weather data and activity rankings
- Weather service to fetch and process Open-Meteo API data
- Ranking algorithm that evaluates weather conditions for each activity
- Clean separation between data fetching, business logic, and API layer

### Frontend (`/client`)
- React application with city search input
- Results display showing 7-day activity rankings
- Clean component structure with separation of concerns

### Key Design Decisions
- GraphQL for flexible data queries and future extensibility
- Service layer pattern for weather data processing
- Algorithm-based ranking system that can be easily extended with new activities
- Focus on code quality and maintainability over UI polish

## Development Commands

Will be updated as project develops with:
- Backend development server
- Frontend development server
- Build and test scripts