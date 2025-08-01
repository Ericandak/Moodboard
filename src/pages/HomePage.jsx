import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/NavBar';
import { useSearch } from '../context/SearchContext';
import SearchResults from '../components/SearchResults';

const HomePage = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  
  const { hasSearched, handleSearch } = useSearch();

  useEffect(() => {
    const fetchMovies = async () => {
      setLoadingPopular(true);
      try {
        const [popularRes, trendingRes] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`),
          axios.get(`https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_API_KEY}`)
        ]);
        
        setPopularMovies(popularRes.data.results.slice(0, 10));
        setTrendingMovies(trendingRes.data.results.slice(0, 5));
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoadingPopular(false);
      }
    };
    
    fetchMovies();
  }, []);

  return (
    <>
    <Navbar onSearch={handleSearch} />
    <div className="min-h-screen bg-base-300">
      
      
      <main className="container mx-auto px-4 py-8 mt-20">
        {!hasSearched ? (
          <>
            {/* Hero Section with Trending Movies */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Trending This Week</h2>
              <div className="carousel w-full rounded-box">
                {trendingMovies.map((movie, idx) => (
                  <div key={movie.id} id={`slide${idx}`} className="carousel-item relative w-full">
                    <div className="relative w-full aspect-[21/9]">
                      <img 
                        src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                        className="w-full h-full object-cover"
                        alt={movie.title}
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent flex items-center">
                        <div className="p-8 max-w-2xl">
                          <h3 className="text-4xl font-bold text-white mb-4">{movie.title}</h3>
                          <p className="text-gray-200 mb-6 line-clamp-3">{movie.overview}</p>
                          <Link to={`/movie/${movie.id}`} className="btn btn-primary">
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                      <a href={`#slide${idx === 0 ? trendingMovies.length - 1 : idx - 1}`} className="btn btn-circle">❮</a> 
                      <a href={`#slide${idx === trendingMovies.length - 1 ? 0 : idx + 1}`} className="btn btn-circle">❯</a>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Popular Movies Grid */}
            <section>
              <h2 className="text-3xl font-bold mb-6">Popular Movies</h2>
              {loadingPopular ? (
                <div className="flex justify-center p-8">
                  <span className="loading loading-spinner loading-lg"></span>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {popularMovies.map((movie) => (
                    <Link 
                      to={`/movie/${movie.id}`}
                      key={movie.id}
                      className="card bg-base-200 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
                    >
                      <figure className="relative">
                        <img 
                          src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/Seven.jpg'}
                          alt={movie.title}
                          className="w-full aspect-[2/3] object-cover"
                        />
                        <div className="absolute top-4 right-4 bg-black/70 rounded-full p-2 backdrop-blur-sm">
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-400">★</span>
                            <span className="text-white font-semibold">{movie.vote_average.toFixed(1)}</span>
                          </div>
                        </div>
                      </figure>
                      <div className="card-body p-4">
                        <h3 className="font-bold text-lg line-clamp-1">{movie.title}</h3>
                        <p className="text-sm opacity-70">{new Date(movie.release_date).getFullYear()}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </>
        ) : (
          <SearchResults />
        )}
      </main>
    </div>
    </>
  );
};

export default HomePage;
