const { Router } = require('express');
const jobController = require('../controllers/jobController');

const router = Router();

// Route to generate job listings
router.post('/', jobController.generateJobListings);

module.exports = router;
