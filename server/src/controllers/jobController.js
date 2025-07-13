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

const validateCourse = async (req, res) => {
    try {
        // Extract course/major from request body
        const { courseMajor } = req.body;
        
        if (!courseMajor) {
            return res.status(400).json({ 
                error: 'Course/major is required',
                message: 'Please provide a course or major to validate'
            });
        }
        
        console.log('🎓 Course validation request:', {
            courseMajor: courseMajor
        });
        
        // Validate course using the groq service
        const validationResult = await groqService.validateCourseMajor(courseMajor);
        
        console.log('✅ Course validation result:', validationResult);
        
        res.json(validationResult);
    } catch (error) {
        console.error('Error validating course:', error);
        res.status(500).json({ 
            error: 'Internal Server Error',
            message: 'Failed to validate course/major'
        });
    }
};

module.exports = {
    generateJobListings,
    validateCourse
};
