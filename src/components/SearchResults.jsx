import React from 'react';
import { Link } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';

const SearchResults = ({ variant = 'grid', currentMovieId = null }) => {
  const { searchResults, hasSearched, isSearching, clearSearch } = useSearch();

  if (variant === 'overlay' && hasSearched) {
    return (
      <>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/30 z-40"
          onClick={clearSearch}
        />
        
        {/* Search Results Panel */}
        <div className="fixed top-16 left-0 right-0 h-[400px] bg-base-200 shadow-2xl z-50 transform transition-transform duration-300 ease-out">
          <div className="flex items-center justify-between px-6 py-3 border-b border-base-300">
            <h2 className="text-lg font-semibold">Search Results</h2>
            <button 
              onClick={clearSearch}
              className="btn btn-ghost btn-sm btn-circle"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <div className="p-4 h-[calc(400px-64px)] overflow-y-auto">
            {isSearching ? (
              <div className="flex justify-center items-center h-full">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="alert alert-info">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>No movies found. Try another search.</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {searchResults.map((movie) => (
                  <Link 
                    to={`/movie/${movie.id}`} 
                    key={movie.id}
                    onClick={clearSearch}
                    className={`card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300
                      ${movie.id === parseInt(currentMovieId) ? 'ring-2 ring-primary' : ''}`}
                  >
                    <figure className="relative aspect-[2/3]">
                      <img 
                        src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/Seven.jpg'}
                        alt={movie.title}
                        className="w-full h-full object-cover rounded-t-lg"
                      />
                      <div className="absolute top-2 right-2 bg-black/70 rounded-full p-1.5 backdrop-blur-sm">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400 text-xs">★</span>
                          <span className="text-white text-xs">{movie.vote_average?.toFixed(1)}</span>
                        </div>
                      </div>
                    </figure>
                    <div className="p-2">
                      <h3 className="font-medium text-sm line-clamp-1">{movie.title}</h3>
                      <p className="text-xs opacity-70">
                        {new Date(movie.release_date).getFullYear()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  // Grid variant (default) remains the same for HomePage
  if (hasSearched) {
    return (
      <div className="container mx-auto px-4">
        {searchResults.length === 0 ? (
          <div className="alert alert-info">
            <span>No movies found. Try another search.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((movie) => (
              <Link 
                to={`/movie/${movie.id}`} 
                key={movie.id}
                className="card bg-base-200 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
              >
                <figure className="relative aspect-[2/3]">
                  <img 
                    src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/Seven.jpg'}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-black/70 rounded-full p-2 backdrop-blur-sm">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-white font-semibold">{movie.vote_average?.toFixed(1)}</span>
                    </div>
                  </div>
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{movie.title}</h2>
                  <p className="text-sm opacity-70">{new Date(movie.release_date).getFullYear()}</p>
                  <p className="line-clamp-2 text-sm opacity-80">{movie.overview}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default SearchResults;