const { Router } = require('express');
const jobController = require('../controllers/jobController');

const router = Router();

router.get('/', jobController.getJobListings);

module.exports = router;
