import { useState } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { 
  SEARCH_LOCATIONS, 
  GET_ACTIVITY_RANKINGS, 
  GET_WEATHER_FORECAST, 
  GET_MARINE_FORECAST 
} from '../services/graphql/queries';
import {
  SearchLocationsVariables,
  SearchLocationsResponse,
  GetActivityRankingsVariables,
  GetActivityRankingsResponse,
  Location
} from '../types/api.types';

// =============================================================================
// SEARCH LOCATIONS HOOK
// =============================================================================

export const useSearchLocations = () => {
  const [searchLocations, { data, loading, error }] = useLazyQuery<
    SearchLocationsResponse,
    SearchLocationsVariables
  >(SEARCH_LOCATIONS);

  const search = (query: string) => {
    if (query.trim()) {
      searchLocations({ variables: { query } });
    }
  };

  return {
    search,
    locations: data?.searchLocations || [],
    loading,
    error
  };
};

// =============================================================================
// GET ACTIVITY RANKINGS HOOK
// =============================================================================

export const useActivityRankings = () => {
  const [getActivityRankings, { data, loading, error }] = useLazyQuery<
    GetActivityRankingsResponse,
    GetActivityRankingsVariables
  >(GET_ACTIVITY_RANKINGS);

  const fetchRankings = (location: Location) => {
    getActivityRankings({
      variables: {
        city: location.name,
        country: location.country,
        latitude: location.latitude,
        longitude: location.longitude
      },
      fetchPolicy: 'network-only' // Bypass cache to avoid mutation issues
    });
  };

  const fetchRankingsWithParams = (params: GetActivityRankingsVariables) => {
    getActivityRankings({ 
      variables: params,
      fetchPolicy: 'network-only' // Bypass cache to avoid mutation issues
    });
  };

  return {
    fetchRankings,
    fetchRankingsWithParams,
    rankings: data?.getActivityRankings,
    loading,
    error
  };
};

// =============================================================================
// COMBINED HOOK FOR FULL WORKFLOW
// =============================================================================

export const useGeoRankerWorkflow = () => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const searchHook = useSearchLocations();
  const rankingsHook = useActivityRankings();

  const selectLocation = (location: Location) => {
    setSelectedLocation(location);
    rankingsHook.fetchRankings(location);
  };

  const searchAndSelect = (query: string) => {
    searchHook.search(query);
  };

  return {
    // Search functionality
    searchLocations: searchAndSelect,
    locations: searchHook.locations,
    searchLoading: searchHook.loading,
    searchError: searchHook.error,

    // Location selection
    selectedLocation,
    selectLocation,

    // Rankings functionality
    rankings: rankingsHook.rankings,
    rankingsLoading: rankingsHook.loading,
    rankingsError: rankingsHook.error,

    // Utility
    isLoading: searchHook.loading || rankingsHook.loading,
    hasError: searchHook.error || rankingsHook.error
  };
};

// =============================================================================
// ADDITIONAL GRANULAR HOOKS
// =============================================================================

export const useWeatherForecast = (latitude?: number, longitude?: number) => {
  return useQuery(GET_WEATHER_FORECAST, {
    variables: { latitude: latitude!, longitude: longitude! },
    skip: !latitude || !longitude
  });
};

export const useMarineForecast = (latitude?: number, longitude?: number) => {
  return useQuery(GET_MARINE_FORECAST, {
    variables: { latitude: latitude!, longitude: longitude! },
    skip: !latitude || !longitude
  });
};