import { useState } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { useDebounce } from './useDebounce';
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
  const [searchLocations, { data, loading, error, client }] = useLazyQuery<
    SearchLocationsResponse,
    SearchLocationsVariables
  >(SEARCH_LOCATIONS);

  const search = (query: string) => {
    if (query.trim()) {
      searchLocations({ variables: { query } });
    }
  };

  const clearResults = () => {
    // Clear the Apollo cache for this query to remove search results
    client?.cache.evict({ fieldName: 'searchLocations' });
    client?.cache.gc();
  };

  return {
    search,
    clearResults,
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

  // Debounced search function - prevents rapid API calls when typing/clicking quickly
  const debouncedSearch = useDebounce((query: string) => {
    searchHook.search(query);
  }, 300); // 300ms delay

  // Debounced location selection - prevents rapid API calls when clicking multiple locations
  const debouncedSelectLocation = useDebounce((location: Location) => {
    setSelectedLocation(location);
    rankingsHook.fetchRankings(location);
  }, 200); // 200ms delay (shorter for better UX)

  const selectLocation = (location: Location) => {
    // Update selected location immediately for UI feedback
    setSelectedLocation(location);
    // But debounce the API call
    debouncedSelectLocation(location);
  };

  const searchAndSelect = (query: string) => {
    debouncedSearch(query);
  };

  // For quick examples - no debouncing needed since these are intentional clicks
  const searchLocationsImmediate = (query: string) => {
    searchHook.search(query);
  };

  const selectLocationImmediate = (location: Location) => {
    setSelectedLocation(location);
    rankingsHook.fetchRankings(location);
    // Clear search results when directly selecting a location (like Cape Town example)
    searchHook.clearResults();
  };

  return {
    // Search functionality
    searchLocations: searchAndSelect,
    searchLocationsImmediate, // For quick examples
    locations: searchHook.locations,
    searchLoading: searchHook.loading,
    searchError: searchHook.error,

    // Location selection
    selectedLocation,
    selectLocation,
    selectLocationImmediate, // For quick examples

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