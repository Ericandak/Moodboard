// server/index.js

const express = require('express');
const mongoose = require('mongoose');
const cors=require('cors');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const reviewRoutes = require('./routes/reviews');


const app = express();
const PORT = 5000;
const MONGO_URI = process.env.MONGO_URI;

// 1. Middleware
app.use(cors());
app.use(express.json()); 

// 2. Routes
app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);

app.get('/', (req, res) => {
  res.send('Hello from the backend server!');
});

// 3. Database Connection
mongoose.connect(MONGO_URI)
  .then(() => console.log("successfully connected to database"))
  .catch(err => console.error('Connection err:', err));

// 4. Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});