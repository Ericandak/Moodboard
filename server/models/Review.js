const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // This creates the connection to the User model
    required: true,
  },
  movieId: {
    type: String, // The ID from the TMDB API
    required: true,
  },
  movieTitle: {
    type: String,
    required: true,
  },
  moviePosterPath: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  reviewText: {
    type: String,
    default: '', // A user might just rate without writing a review
  },
  sentiment: {
    score: Number,
    label: String,
  },
  likes: {
    type: Number,
    default: 0,
  },
  tags: {
    type: [String], // An array of strings
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

module.exports = mongoose.model('Review', ReviewSchema);