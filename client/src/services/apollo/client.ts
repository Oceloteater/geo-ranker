import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';

// =============================================================================
// APOLLO CLIENT CONFIGURATION
// =============================================================================

const httpLink = createHttpLink({
  uri: process.env.NODE_ENV === 'production' 
    ? '/graphql'  // Use relative URL in production
    : 'http://localhost:4000/graphql'  // Full URL for development
});

// Error link to handle GraphQL errors
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(`GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`);
    });
  }

  if (networkError) {
    console.error(`Network error: ${networkError}`);
  }
});

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        searchLocations: {
          // Don't cache search results to get fresh data
          keyArgs: false,
          merge(existing, incoming) {
            return incoming;
          }
        },
        getActivityRankings: {
          // Cache activity rankings by location
          keyArgs: ['city', 'country', 'latitude', 'longitude'],
          merge(existing, incoming) {
            return incoming;
          }
        }
      }
    },
    DailyRanking: {
      fields: {
        rankings: {
          merge(existing, incoming) {
            return incoming;
          }
        }
      }
    }
  }
});

export const apolloClient = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache,
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-and-network'
    },
    query: {
      errorPolicy: 'all',
      fetchPolicy: 'network-only'
    }
  }
});

export default apolloClient;