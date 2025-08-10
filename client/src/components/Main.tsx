import React, { useState } from 'react';
import { useGeoRankerWorkflow } from '../hooks/useGeoRankerApi';
import { Location } from '../types/api.types';
import { exampleLocationQuery } from '../types/examples';
import QuickExamples from './QuickExamples';
import SearchForm from './SearchForm';
import LocationResults from './LocationResults';
import ActivityRankings from './ActivityRankings';

const Main: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

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
      searchLocations(searchQuery);
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

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🌦️ Geo-Ranker</h1>
      
      <QuickExamples 
        onSearchExample={handleExampleQuery}
        onDirectLocationQuery={handleDirectLocationQuery}
      />
      
      <SearchForm 
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onSubmit={handleSearch}
        loading={searchLoading}
        error={searchError}
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