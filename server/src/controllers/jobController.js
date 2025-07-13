const groqService = require('../services/groqJobListingService.js');

const generateJobListings = async (req, res) => {
    try {
        const jobListings = await groqService.generateJobPositions();
        res.json(jobListings);
    } catch (error) {
        console.error('Error fetching job listings:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    generateJobListings
};
