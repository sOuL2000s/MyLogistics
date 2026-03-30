require('dotenv').config();
const express = require('express');
const colors = require('colors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const shipmentRoutes = require('./routes/shipmentRoutes');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // For parsing application/json
app.use(morgan('dev')); // Logger for requests

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/users', userRoutes); // Admin user management

// Public tracking route
app.get('/api/track/:trackingNumber', require('./controllers/shipmentController').getPublicTracking);

// Default route
app.get('/', (req, res) => {
  res.send('Logistics API is running...');
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.yellow.bold);
});
