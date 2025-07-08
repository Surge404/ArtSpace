const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const gigRoutes = require('./routes/gigs');
const paymentRoutes = require('./routes/payments');
const uploadRoutes = require('./routes/upload'); // Add this line

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/gigs', gigRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/upload', uploadRoutes); // Add this line

app.get('/', (req, res) => {
  res.json({ message: 'ArtSpace API is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
