const { Router } = require('express');
const jobController = require('../controllers/jobController');

const router = Router();

// Route to generate job listings
router.post('/generate-jobs', jobController.generateJobListings);

// Route to validate course/major
router.post('/validate-course', jobController.validateCourse);

module.exports = router;
