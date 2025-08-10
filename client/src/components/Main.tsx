import React, { useState } from 'react';
import { useGeoRankerWorkflow } from '../hooks/useGeoRankerApi';
import { useResponsive } from '../hooks/useResponsive';
import { Location } from '../types/api.types';
import { exampleLocationQuery } from '../types/examples';
import QuickExamples from './QuickExamples';
import SearchForm from './SearchForm';
import LocationResults from './LocationResults';
import ActivityRankings from './ActivityRankings';

const Main: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmptySearchMessage, setShowEmptySearchMessage] = useState(false);
  const { isMobile, isDesktop } = useResponsive();

  const {
    searchLocations,
    locations,
    searchLoading,
    searchError,
    selectedLocation,
    selectLocation,
    rankings,
    rankingsLoading,
    rankingsError
  } = useGeoRankerWorkflow();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowEmptySearchMessage(false);
      searchLocations(searchQuery);
    } else {
      setShowEmptySearchMessage(true);
    }
  };

  const handleLocationSelect = (location: Location) => {
    selectLocation(location);
  };

  const handleExampleQuery = (exampleQuery: string) => {
    setSearchQuery(exampleQuery);
    searchLocations(exampleQuery);
  };

  const handleDirectLocationQuery = () => {
    selectLocation({
      name: exampleLocationQuery.city,
      country: exampleLocationQuery.country,
      latitude: exampleLocationQuery.latitude,
      longitude: exampleLocationQuery.longitude,
      timezone: exampleLocationQuery.timezone,
    });
  };

  const getContainerStyle = () => ({
    padding: isMobile ? '16px' : '20px',
    fontFamily: 'Arial, sans-serif',
    maxWidth: isDesktop ? '1400px' : '100%',
    margin: '0 auto',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa'
  });

  const getTitleStyle = () => ({
    textAlign: 'center' as const,
    marginBottom: isMobile ? '24px' : '32px',
    fontSize: isMobile ? '28px' : '36px',
    color: '#2c3e50',
    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
  });

  return (
    <div style={getContainerStyle()}>
      <h1 style={getTitleStyle()}>🌦️ Geo-Ranker</h1>
      
      <QuickExamples 
        onSearchExample={handleExampleQuery}
        onDirectLocationQuery={handleDirectLocationQuery}
      />
      
      <SearchForm 
        searchQuery={searchQuery}
        onSearchQueryChange={(value) => {
          setSearchQuery(value);
          if (showEmptySearchMessage && value.trim()) {
            setShowEmptySearchMessage(false);
          }
        }}
        onSubmit={handleSearch}
        loading={searchLoading}
        error={searchError}
        showEmptySearchMessage={showEmptySearchMessage}
      />

      <LocationResults 
        locations={locations}
        selectedLocation={selectedLocation}
        onLocationSelect={handleLocationSelect}
      />

      <ActivityRankings
        selectedLocation={selectedLocation}
        rankings={rankings}
        loading={rankingsLoading}
        error={rankingsError}
      />
    </div>
  );
};

export default Main;