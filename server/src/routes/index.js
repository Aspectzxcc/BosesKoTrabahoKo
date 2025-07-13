const { Router } = require('express');

const jobRoutes = require('./jobRoutes');

const router = Router();

// API Routes
router.use('/jobs', jobRoutes);

module.exports = router;