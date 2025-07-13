const groqService = require('../services/groqJobListingService.js');

const getJobListings = async (req, res) => {
    try {
        const jobListings = await groqService.fetchJobListings();
        res.json(jobListings);
    } catch (error) {
        console.error('Error fetching job listings:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getJobListings
};
