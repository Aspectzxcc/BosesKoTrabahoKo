const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
// app.use('/api/reading', readingRoutes);

// Simple health check route
app.get('/', (req, res) => {
    res.send('backend is running!');
});

module.exports = app;
