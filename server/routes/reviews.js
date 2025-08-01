const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const auth = require('../middleware/auth');

// @route   POST /api/reviews
// @desc    Create a new movie review
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    // 1. Get review details from the request body
    const { movieId, movieTitle, moviePosterPath, rating, reviewText, tags } = req.body;

    // 2. Create a new review object, including the user ID from the auth middleware
    const newReview = new Review({
      movieId,
      movieTitle,
      moviePosterPath,
      rating,
      reviewText,
      tags,
      user: req.user.id // Get user ID from the middleware
    });

    // 3. Save the new review to the database
    const savedReview = await newReview.save();

    // 4. Send the saved review back as a response
    res.status(201).json(savedReview);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/movie/:movieId',async(req,res)=>{
  try{
    console.log('Fetching reviews for movie:', req.params.movieId);
    const reviews=await Review.find({movieId: req.params.movieId}).populate('user','username').sort({createdAt: -1})
    console.log('Found reviews:', reviews);
    res.json(reviews)
  }catch(err){
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

module.exports = router;