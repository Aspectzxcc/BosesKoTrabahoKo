const groqService = require('../services/groqPromptService.js');

const generateJobListings = async (req, res) => {
    try {
        // Extract user profile from request body
        const { userProfile } = req.body;
        
        // Generate job listings with user profile data
        const jobListings = await groqService.generateJobPositions(userProfile);
        res.json(jobListings);
    } catch (error) {
        console.error('Error fetching job listings:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    generateJobListings
};
