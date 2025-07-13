const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, '../../client/dist')));

const routes = require('./routes/index');

// API Routes (must come before catch-all route)
app.use('/api', routes);

// Catch-all handler: send back React's index.html file for client-side routing
// Use a more specific pattern to avoid conflicts
app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist', 'index.html'));
});

module.exports = app;
