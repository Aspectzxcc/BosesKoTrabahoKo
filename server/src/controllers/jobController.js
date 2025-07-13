const groqService = require('../services/groqPromptService.js');

const generateJobListings = async (req, res) => {
    try {
        // Extract user profile and refresh flag from request body
        const { userProfile, isRefresh = false } = req.body;
        
        console.log('🔄 Job generation request:', {
            hasUserProfile: !!userProfile,
            isRefresh: isRefresh,
            userFullName: userProfile?.welcome?.fullName || 'Anonymous'
        });
        
        // Generate job listings with user profile data and refresh option
        const jobListings = await groqService.generateJobPositions(userProfile, isRefresh);
        res.json(jobListings);
    } catch (error) {
        console.error('Error fetching job listings:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    generateJobListings
};
