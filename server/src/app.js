const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const routes = require('./routes/index');

// API Routes
app.use('/api', routes);

// Simple health check route
app.get('/', (req, res) => {
    res.send('backend is running!');
});

module.exports = app;
