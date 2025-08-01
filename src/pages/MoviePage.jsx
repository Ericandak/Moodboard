import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckIcon } from '@heroicons/react/24/solid';
import Navbar from '../components/NavBar';
import { useSearch} from '../context/SearchContext';
import { fetchMovieDetails,fetchReviews,fetchCastandCrew } from '../services/tmdbServices';
import SearchResults from '../components/SearchResults';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const MoviePage = () => {
  const { id } = useParams();
  console.log('Movie ID:', id);
  const [movie, setMovie] = useState(null);
  const [movieReview,setMovieReview] = useState(null);
  const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  
  // Get search context values
  const { searchResults, hasSearched, handleSearch, clearSearch } = useSearch();
  const [activeTab, setActiveTab] = useState('cast'); // Add this for tab control
  const [cast, setCast] = useState([]); // Add state for cast data
  const [crew, setCrew] = useState([]);

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    clearSearch();
    console.log('Fetching movie details for movie ID:', id);
    const getMovieDetails = async () => {
      const [moviedata,reviewData,castData] = await Promise.all([fetchMovieDetails(id),
      fetchReviews(id),fetchCastandCrew(id)]);
      console.log('Review Data from API:', reviewData); 
      setMovie(moviedata);
      setMovieReview(reviewData);
      setCast(castData.cast);
      setCrew(castData.crew);

      // Fetch cast and crew data

    };

    getMovieDetails();
  }, [id]);

  if (!movie) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/Seven.jpg';
  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
    : '/Seven.jpg';

  const logo = movie.production_companies[0]?.logo_path
    ? `https://image.tmdb.org/t/p/w500${movie.production_companies[0].logo_path}`
    : '/Seven.jpg';

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem('token');
    if (!token || !movie) return;

    const reviewData = {
      movieId: movie.id,
      movieTitle: movie.title,
      moviePosterPath: movie.poster_path,
      rating: rating,
      reviewText: reviewText,
    };

    try {
      await axios.post('http://localhost:5000/api/reviews', reviewData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert('Review submitted successfully!');
      document.getElementById('review-modal').close();
      setRating(0);
      setReviewText('');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please make sure you are logged in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tab content components
  const CastTab = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {cast.map((member) => (
        <div key={member.id} 
          className="card bg-base-200 shadow-xl hover:scale-105 transition-all duration-300 group"
        >
          <figure className="relative">
            <img
              src={member.profile_path 
                ? `https://image.tmdb.org/t/p/w500${member.profile_path}`
                : 'https://via.placeholder.com/300x450?text=No+Image'}
              alt={member.name}
              className="w-full aspect-[2/3] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
              <div className="text-white">
                <p className="text-xs">{member.character}</p>
              </div>
            </div>
          </figure>
          <div className="card-body p-3 bg-base-200">
            <h3 className="font-semibold text-sm truncate">{member.name}</h3>
            <p className="text-xs opacity-70 line-clamp-1">{member.character}</p>
          </div>
        </div>
      ))}
    </div>
  );
  const CrewTab = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {crew.map((member) => (
        <div key={member.id} 
          className="card bg-base-200 shadow-xl hover:scale-105 transition-all duration-300 group"
        >
          <figure className="relative">
            <img
              src={member.profile_path 
                ? `https://image.tmdb.org/t/p/w500${member.profile_path}`
                : 'https://via.placeholder.com/300x450?text=No+Image'}
              alt={member.name}
              className="w-full aspect-[2/3] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
              <div className="text-white">
                <p className="text-xs">{member.job}</p>
              </div>
            </div>
          </figure>
          <div className="card-body p-3 bg-base-200">
            <h3 className="font-semibold text-sm truncate">{member.name}</h3>
            <p className="text-xs opacity-70 line-clamp-1">{member.job}</p>
          </div>
        </div>
      ))}
    </div>
  );
  // Fix the ReviewTab component
const ReviewTab = () => {
  // Function to calculate rating distribution
  const calculateRatingDistribution = () => {
    if (!movieReview || movieReview.length === 0) return [];
    
    // Initialize counts for each rating
    const distribution = {
      '5 Stars': 0,
      '4 Stars': 0,
      '3 Stars': 0,
      '2 Stars': 0,
      '1 Star': 0
    };

    // Count ratings
    movieReview.forEach(review => {
      const rating = review.rating;
      distribution[`${rating} Star${rating === 1 ? '' : 's'}`]++;
    });

    // Convert to array format for Recharts
    return Object.entries(distribution).map(([name, count]) => ({
      name,
      count
    })).reverse(); // Reverse to show 5 stars first
  };

  // Calculate average rating
  const averageRating = movieReview && movieReview.length > 0
    ? (movieReview.reduce((acc, review) => acc + review.rating, 0) / movieReview.length).toFixed(1)
    : 0;

  return (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body">
        <h3 className="card-title text-primary">Reviews</h3>
        
        {/* Rating Statistics */}
        {movieReview && movieReview.length > 0 && (
          <div className="mb-4">
            {/* Compact Stats Card */}
            <div className="stats shadow bg-primary text-primary-content w-full">
              <div className="stat py-2">
                <div className="stat-title text-primary-content/80 text-sm">Average Rating</div>
                <div className="stat-value text-2xl flex items-center gap-1">
                  {averageRating} <span className="text-yellow-300">★</span>
                </div>
                <div className="stat-desc text-primary-content/80 text-xs">From {movieReview.length} reviews</div>
              </div>
            </div>

            {/* Compact Rating Distribution Chart */}
            <div className="mt-4 h-48 sm:h-56 bg-base-100 rounded-box p-2 sm:p-4 shadow-lg">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={calculateRatingDistribution()}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  barSize={20}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis 
                    dataKey="name" 
                    scale="point" 
                    tick={{ fontSize: 12 }}
                    interval={0}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    width={30}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)', 
                      border: 'none',
                      borderRadius: '4px',
                      padding: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Bar 
                    dataKey="count" 
                    name="Reviews"
                    radius={[2, 2, 0, 0]}
                  >
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.9}/>
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.7}/>
                      </linearGradient>
                    </defs>
                    {calculateRatingDistribution().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="url(#colorCount)" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Existing Reviews List */}
        <div className="space-y-4">
          {movieReview && movieReview.length > 0 ? (
            movieReview.map((review) => (
              <div key={review._id} className="card bg-base-100 shadow-md">
                <div className="card-body">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="rating rating-sm">
                      {[...Array(5)].map((_, i) => (
                        <input
                          key={i}
                          type="radio"
                          className={`mask mask-star-2 ${i < review.rating ? 'bg-yellow-400' : 'bg-gray-300'}`}
                          
                          readOnly
                        />
                      ))}
                    </div>
                    <span className="text-sm opacity-70">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm">{review.reviewText}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="alert alert-info">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>No reviews yet. Be the first to review!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};



  // Enhanced Info Tab with better organization
  const InfoTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h3 className="card-title text-primary">Release Information</h3>
          <div className="space-y-2">
            <div className="stats stats-vertical shadow w-full">
              <div className="stat">
                <div className="stat-title">Release Date</div>
                <div className="stat-value text-lg">
                  {new Date(movie.release_date).toLocaleDateString()}
                </div>
              </div>
              <div className="stat">
                <div className="stat-title">Status</div>
                <div className="stat-value text-lg">{movie.status}</div>
              </div>
              {movie.runtime && (
                <div className="stat">
                  <div className="stat-title">Runtime</div>
                  <div className="stat-value text-lg">
                    {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h3 className="card-title text-primary">Genres</h3>
          <div className="flex flex-wrap gap-2">
            {movie.genres?.map(genre => (
              <div key={genre.id} className="badge badge-lg badge-primary">{genre.name}</div>
            ))}
          </div>
          
          <div className="divider"></div>
          
          <h3 className="card-title text-primary">Production Companies</h3>
          <div className="flex flex-wrap gap-4">
            {movie.production_companies?.map(company => (
              <div key={company.id} 
                className="card bg-base-100 shadow-lg p-4 flex items-center justify-center"
              >
                {company.logo_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                    alt={company.name}
                    className="h-12 object-contain"
                  />
                ) : (
                  <span className="text-sm font-semibold">{company.name}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Enhanced Streaming Tab
  const StreamingTab = () => (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body items-center text-center">
        <h3 className="card-title text-primary">Streaming Platforms</h3>
        <div className="mockup-code">
          <pre><code>Coming soon...</code></pre>
        </div>
      </div>
    </div>
  );

  // Add this after your movie details section and before closing the main div
  const TabContent = () => {
    switch(activeTab) {
      case 'cast': return <CastTab />;
      case 'info': return <InfoTab />;
      case 'streaming': return <StreamingTab />;
      case 'crew': return <CrewTab />;
      case 'reviews': return <ReviewTab />;
      default: return <CastTab />;
    }
  };

  return (
    <div className="min-h-screen bg-base-300">
      <Navbar onSearch={handleSearch} />
      
      <SearchResults variant="overlay" currentMovieId={id} />

      {/* Movie Details Section with adjusted spacing */}
      <div className="hero min-h-[calc(100vh-80px)] bg-base-200" style={{backgroundImage: `url(${backdropUrl})`}}>
        <div className="hero-overlay bg-opacity-80 bg-black"></div>
        <div className="hero-content flex-col lg:flex-row gap-8 py-12">
          <div className="relative max-w-sm">
            <img
              src={posterUrl}
              className="rounded-lg shadow-2xl w-full"
              alt={movie.title}
            />
            {movie.vote_average && (
              <div className="absolute top-4 right-4 bg-black/70 rounded-full p-2 backdrop-blur-sm">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400">★</span>
                  <span className="text-white font-semibold">{movie.vote_average.toFixed(1)}</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="text-white max-w-2xl">
            <h1 className="text-5xl font-bold mb-3">{movie.title}</h1>
            <div className="flex items-center gap-4 mb-6">
              <span>{new Date(movie.release_date).getFullYear()}</span>
              {movie.runtime && (
                <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
              )}
            </div>
            <p className="text-lg leading-relaxed mb-8">{movie.overview}</p>
            
            <div className="flex gap-4 mb-8">
              <button className="btn btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Watch Now
              </button>
              <button 
                className="btn btn-outline btn-primary"
                onClick={() => document.getElementById('review-modal').showModal()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Write Review
              </button>
            </div>

            {/* Additional movie details in a grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {movie.production_companies?.length > 0 && (
                <div className="flex items-center gap-4">
                  <span className="font-bold">Studio:</span>
                  <img 
                    src={logo} 
                    alt={movie.production_companies[0].name}
                    className="h-8 object-contain bg-white/10 rounded px-2"
                  />
                </div>
              )}
              {movie.genres && (
                <div>
                  <span className="font-bold block mb-2">Genres:</span>
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map(genre => (
                      <span key={genre.id} className="badge badge-primary">{genre.name}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Tabs Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-8">
          <div className="tabs tabs-boxed gap-2 bg-base-200 p-1 rounded-full">
            <button
              className={`tab tab-lg transition-all duration-300 ${
                activeTab === 'cast' 
                ? 'tab-active bg-primary text-primary-content rounded-full' 
                : ''
              }`}
              onClick={() => setActiveTab('cast')}
            >
              Cast
            </button>
            <button
              className={`tab tab-lg transition-all duration-300 ${
                activeTab === 'crew'
                ? 'tab-active bg-primary text-primary-content rounded-full'
                : ''
              }`}
              onClick={() => setActiveTab('crew')}
            >
              Crew
            </button>
            <button
              className={`tab tab-lg transition-all duration-300 ${
                activeTab === 'reviews'
                ? 'tab-active bg-primary text-primary-content rounded-full'
                : ''
              }`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews
            </button>
            <button
              className={`tab tab-lg transition-all duration-300 ${
                activeTab === 'streaming' 
                ? 'tab-active bg-primary text-primary-content rounded-full' 
                : ''
              }`}
              onClick={() => setActiveTab('streaming')}
            >
              Where to Watch
            </button>
            <button
              className={`tab tab-lg transition-all duration-300 ${
                activeTab === 'info' 
                ? 'tab-active bg-primary text-primary-content rounded-full' 
                : ''
              }`}
              onClick={() => setActiveTab('info')}
            >
              Movie Info
            </button>
          </div>
        </div>

        <div className="transition-all duration-500 ease-in-out">
          {/* Loading State */}
          {!cast.length && activeTab === 'cast' ? (
            <div className="flex justify-center items-center h-48">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            <TabContent />
          )}
        </div>
      </div>

      {/* Review Modal */}
      <dialog id="review-modal" className="modal">
        <div className="modal-box max-w-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">
              Review for {movie.title}
            </h3>
            <button 
              onClick={() => document.getElementById('review-modal').close()}
              className="btn btn-circle btn-ghost btn-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmitReview} className="space-y-6">
            {/* Movie Info */}
            <div className="flex gap-4 items-start">
              <img 
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
                className="w-24 rounded-lg shadow-lg"
              />
              <div>
                <h4 className="font-semibold">{movie.title}</h4>
                <p className="text-sm opacity-70">
                  {new Date(movie.release_date).getFullYear()} • {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                </p>
              </div>
            </div>

            {/* Rating */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-lg font-semibold">Your Rating</span>
              </label>
              <div className="rating rating-lg gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <input
                    key={value}
                    type="radio"
                    name="rating"
                    className="mask mask-star-2 bg-orange-400"
                    checked={rating === value}
                    onChange={() => setRating(value)}
                  />
                ))}
              </div>
            </div>

            {/* Review Text */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-lg font-semibold">Your Review</span>
              </label>
              <textarea
                className="textarea textarea-bordered h-32"
                placeholder="Write your thoughts about the movie..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                required
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="modal-action">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSubmitting || !rating || !reviewText.trim()}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Submitting...
                  </>
                ) : (
                  'Submit Review'
                )}
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  document.getElementById('review-modal').close();
                  setRating(0);
                  setReviewText('');
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default MoviePage;