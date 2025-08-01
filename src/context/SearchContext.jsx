import React, { createContext, useState, useContext } from 'react';
import { searchMovies } from '../services/tmdbServices';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query) => {
    if (!query) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }
    
    setHasSearched(true);
    try {
      const results = await searchMovies(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching movies:', error);
      setSearchResults([]);
    }
  };
  const clearSearch = () => {
    setSearchResults([]);
    setHasSearched(false);
  };

  return (
    <SearchContext.Provider value={{
      searchResults,
      hasSearched,
      handleSearch,
      clearSearch,
    }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};