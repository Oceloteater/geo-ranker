import { ApolloError } from '@apollo/client';

// =============================================================================
// ERROR TYPES
// =============================================================================

export interface AppError {
  message: string;
  type: 'NETWORK' | 'GRAPHQL' | 'VALIDATION' | 'UNKNOWN';
  details?: string;
}

// =============================================================================
// ERROR HANDLERS
// =============================================================================

export const handleApolloError = (error: ApolloError): AppError => {
  // Network errors
  if (error.networkError) {
    return {
      message: 'Network connection failed. Please check your internet connection.',
      type: 'NETWORK',
      details: error.networkError.message
    };
  }

  // GraphQL errors
  if (error.graphQLErrors && error.graphQLErrors.length > 0) {
    const firstError = error.graphQLErrors[0];
    return {
      message: firstError.message || 'GraphQL query failed',
      type: 'GRAPHQL',
      details: firstError.extensions?.code as string
    };
  }

  // Unknown errors
  return {
    message: error.message || 'An unexpected error occurred',
    type: 'UNKNOWN',
    details: error.message
  };
};

// =============================================================================
// USER-FRIENDLY ERROR MESSAGES
// =============================================================================

export const getUserFriendlyError = (error: ApolloError): string => {
  const appError = handleApolloError(error);
  
  switch (appError.type) {
    case 'NETWORK':
      return 'Unable to connect to the server. Please check your internet connection and try again.';
    
    case 'GRAPHQL':
      // Handle specific GraphQL errors
      if (appError.details?.includes('LOCATION_NOT_FOUND')) {
        return 'Location not found. Please try a different city name.';
      }
      if (appError.details?.includes('WEATHER_DATA_UNAVAILABLE')) {
        return 'Weather data is temporarily unavailable for this location.';
      }
      return appError.message;
    
    case 'VALIDATION':
      return 'Please check your input and try again.';
    
    default:
      return 'Something went wrong. Please try again later.';
  }
};

// =============================================================================
// LOADING STATE HELPERS
// =============================================================================

export const createLoadingState = (isLoading: boolean, operation?: string) => ({
  isLoading,
  message: isLoading ? `${operation || 'Loading'}...` : null
});

export const combineLoadingStates = (...states: boolean[]) => {
  return states.some(state => state);
};