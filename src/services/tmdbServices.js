// src/services/tmdbService.js
import axios from 'axios';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export const searchMovies = async (query) => {
  if (!query) return [];
  const url = `${BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${query}`;
  try {
    const response = await axios.get(url);
    return response.data.results;
  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
};

// We can add more functions here later, like fetchMovieDetails, etc.
export const fetchMovieDetails = async (movieId) => {
    if (!movieId) return null;
    const url = `${BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      return null;
    }
  };
  export const fetchReviews=async(movieId)=>{
    if(!movieId) return null;
    try{
    console.log('Fetching reviews for movie:', movieId);
    const response=await axios.get(`http://localhost:5000/api/reviews/movie/${movieId}`);
    console.log('Reviews response:', response.data);
    return response.data;
  }catch(error){
    console.error('Error fetching reviews:',error);
    return null;
  }
}
export const fetchCastandCrew=async(movieId)=>{ 
  if(!movieId)  return null;
  try{
    const response=await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${TMDB_API_KEY}`)
    return response.data;
  }catch(error){
    console.error('Error fetching cast:',error);
    return null;
  }
}