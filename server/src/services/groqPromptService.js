const { Groq } = require('groq-sdk');
const { config } = require('../utils/config');
const { generateFallbackPositions } = require('../utils/fallbackTemplates');

const groq = new Groq({
    apiKey: config.groqApiKey,
})

const jobListerPrompt = `
### Role
You are an expert AI career advisor for "Boses Ko Trabaho Ko," specializing in identifying and recommending personalized job positions for undergraduate students and recent graduates based on their comprehensive profile data.

### Context
You are tasked with generating realistic, highly-personalized job position recommendations that align with a specific user's academic background, skills, career interests, and aspirations. The user has completed a detailed onboarding process providing information about their education, current skills (both hard and soft), career interests, dream job, work environment preferences, and career priorities.

### User Profile Structure
The user profile contains the following information:
- **Basic Info**: fullName, majorCourse, highestEducation, graduationYear
- **Hard Skills**: Array of technical/specific skills (e.g., "Microsoft Office", "Social Media Management", "Content Writing", "Data Entry", "Customer Service", "Basic Accounting", "Project Management", "Graphic Design", "Video Editing", "Web Development", "Digital Marketing", "Photography", "Public Speaking", "Research", "Translation")
- **Soft Skills**: Array of interpersonal skills (e.g., "Communication", "Teamwork", "Leadership", "Problem Solving", "Time Management", "Adaptability", "Critical Thinking", "Creativity", "Organization", "Attention to Detail", "Multitasking", "Initiative", "Empathy", "Negotiation", "Conflict Resolution", "Mentoring")
- **Career Interests**: Free-text description of areas/industries that interest them (e.g., "Technology, Marketing, Healthcare")
- **Dream Job**: Their aspirational career goal (e.g., "Software Engineer at Google", "Marketing Manager")
- **Work Environment**: Preference for "Remote", "In-office", "Hybrid", or "Flexible"
- **Career Priorities**: Array of selected goals (e.g., "high-salary", "work-life-balance", "career-growth", "job-security", "meaningful-work", "creative-freedom", "team-collaboration", "learning-opportunities")

### Task
Generate a list of highly relevant, AI-curated job position recommendations that are specifically tailored to the user's profile. Each position should align with their skills, interests, education level, and career aspirations while being appropriate for their experience level.

### Personalization Requirements
- Prioritize positions that match the user's stated career interests and dream job direction
- Include positions that utilize their existing hard and soft skills
- Consider their work environment preferences and career priorities
- Ensure experience requirements match their education level and graduation timeline
- Factor in their major/course when relevant to the position

### Instructions
- The output must be a JSON object with a single root key: "job_positions".
- The value of "job_positions" must be a JSON array.
- This array must contain between 3-5 JSON objects, each representing a unique job position recommendation.
- Each position object must contain the following keys and appropriate values:
  - "position_id": A unique string identifier for the position (e.g., "pos_2024_001").
  - "position_title": The full title of the job position, aligned with user's interests and skill level.
  - "experience_level": Required experience level matching their profile ("Entry-Level", "No Experience Required", "Internship", "Fresh Graduate").
  - "match_score": An integer percentage (70-95) indicating relevance to the specific user profile.
  - "position_summary": A concise, compelling overview that highlights why this position suits the user.
  - "role_description": A detailed paragraph describing the role and its appeal to this specific user.
  - "key_responsibilities": Array of primary responsibilities that align with user's skills and interests.
  - "required_qualifications": Array of educational and experience requirements that match the user's background.
  - "required_skills": Array of skills prioritizing those the user already possesses, with some growth opportunities.
  - "skill_development_opportunities": Array of skills the user can develop and learn in this position.
  - "career_growth_path": Description of potential advancement opportunities from this position.
  - "work_environment_fit": How this position aligns with their work environment preferences.
  - "career_priorities_alignment": How this position matches their stated career priorities and values.
  - "industry_sector": The industry or sector this position belongs to.
  - "typical_salary_range": Appropriate compensation range for entry-level in the Philippines job market.

### Constraints
- Generate 3-5 distinct position recommendations that offer variety while staying relevant to the user
- Match scores should reflect actual alignment with user profile (higher scores for better matches)
- Ensure positions are realistic for the Philippine job market and entry-level candidates
- Include a mix of industries if user has diverse interests, or focus on specific area if clearly defined
- Response must be valid JSON only, no additional text or markdown
- Focus on position characteristics rather than specific company details
`;

        const userContext = 
        `
        ### USER PROFILE DATA ###
        
        **Basic Information:**
        - Full Name: ${welcome.fullName || 'Not provided'}
        - Major/Course: ${welcome.majorCourse || 'General studies'}
        - Highest Education: ${welcome.highestEducation || 'Undergraduate'}
        - Graduation Year: ${welcome.graduationYear || 'Recent graduate'}
        
        **Technical & Hard Skills:**
        ${skills.selectedHardSkills && skills.selectedHardSkills.length > 0 
            ? skills.selectedHardSkills.map(skill => `- ${skill}`).join('\n')
            : '- Basic computer skills\n- Communication\n- Willingness to learn'
        }
        
        **Soft Skills & Personal Qualities:**
        ${skills.selectedSoftSkills && skills.selectedSoftSkills.length > 0
            ? skills.selectedSoftSkills.map(skill => `- ${skill}`).join('\n')
            : '- Communication\n- Teamwork\n- Adaptability'
        }
        
        **Career Interests & Industries:**
        ${userProfile.careerInterests || 'Open to various opportunities in different industries'}
        
        **Dream Job/Career Aspiration:**
        ${careerGoals.dreamJob || userProfile.dreamJob || 'Seeking entry-level opportunities to build career foundation'}
        
        **Work Environment Preference:**
        ${careerGoals.workEnvironment || userProfile.workEnvironment || 'Flexible work arrangements'}
        
        **Career Priorities & Values:**
        ${careerGoals.selectedGoals && careerGoals.selectedGoals.length > 0
            ? careerGoals.selectedGoals.map(priority => `- ${priority.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`).join('\n')
            : userProfile.selectedGoals && userProfile.selectedGoals.length > 0
                ? userProfile.selectedGoals.map(priority => `- ${priority.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`).join('\n')
                : '- Learning opportunities\n- Career growth\n- Work-life balance'
        }
        
        **Location Preference:**
        Philippines (flexible location)
        
        ### PERSONALIZATION INSTRUCTIONS ###
        Based on this comprehensive profile, generate position recommendations that:
        1. Align with their stated career interests and dream job direction
        2. Utilize their existing hard and soft skills while offering growth opportunities
        3. Match their work environment preferences and career priorities
        4. Are appropriate for their education level and experience
        5. Consider their major/course background when relevant
        6. Provide realistic opportunities in the Philippine job market
        7. Focus on position characteristics, responsibilities, and growth potential
        
        Generate highly personalized, relevant job position recommendations for this specific user.
        `
        .trim();

        console.log('🤖 Sending request to Groq AI with user context length:', userContext.length);
        console.log('⚙️ AI request parameters:', {
            model: "llama-3.1-8b-instant",
            temperature: 0.4,
            max_tokens: 4096,
            response_format: "json_object"
        });

async function generateJobPositions(userProfile = {}) {
    // Extract data from the new nested structure
    const welcome = userProfile.welcome || {};
    const skills = userProfile.skills || {};
    const careerGoals = userProfile.careerGoals || {};
    
    console.log('🚀 Starting job position generation for user:', welcome.fullName || 'Anonymous');
    console.log('📋 User profile received:', {
        hasBasicInfo: !!(welcome.fullName && welcome.majorCourse),
        hardSkillsCount: skills.selectedHardSkills?.length || 0,
        softSkillsCount: skills.selectedSoftSkills?.length || 0,
        hasCareerInterests: !!userProfile.careerInterests,
        hasDreamJob: !!(careerGoals.dreamJob || userProfile.dreamJob),
        workEnvironment: careerGoals.workEnvironment || userProfile.workEnvironment || 'not specified'
    });

    try {
        const chatCompletion = await groq.chat.completions.create({
            "messages": [
                {
                    "role": "system",
                    "content": jobListerPrompt
                },
                {
                    "role": "user",
                    "content": userContext
                }
            ],
            "model": "llama-3.1-8b-instant",
            "temperature": 0.4,
            "max_tokens": 4096,
            "top_p": 1,
            "response_format": { "type": "json_object" }
        });

        const jsonStringResponse = chatCompletion.choices[0]?.message?.content;
        
        console.log('📨 Received AI response:', {
            hasResponse: !!jsonStringResponse,
            responseLength: jsonStringResponse?.length || 0,
            tokensUsed: chatCompletion.usage?.total_tokens || 'unknown'
        });

        if (!jsonStringResponse) {
            console.error('❌ No response received from AI service');
            throw new Error('No response received from AI service');
        }

        console.log('🔍 Parsing AI response as JSON...');
        const aiResponse = JSON.parse(jsonStringResponse);
        console.log('✅ Successfully parsed AI response');
        
        // Validate the response structure
        if (!aiResponse.job_positions || !Array.isArray(aiResponse.job_positions)) {
            console.error('❌ Invalid response format:', {
                hasJobPositions: !!aiResponse.job_positions,
                isArray: Array.isArray(aiResponse.job_positions),
                responseKeys: Object.keys(aiResponse)
            });
            throw new Error('Invalid response format: missing or invalid job_positions array');
        }

        console.log('📊 AI generated', aiResponse.job_positions.length, 'job positions');

        // Return the job positions with enhanced validation and fallbacks
        const jobPositions = aiResponse.job_positions.map((position, index) => {
            console.log(`🔧 Processing position ${index + 1}: ${position.position_title || 'Unknown Title'}`);
            
            // Ensure required fields exist with intelligent fallbacks based on user profile
            return {
                position_id: position.position_id || `pos_${Date.now()}_${index}`,
                position_title: position.position_title || 'Entry-Level Position',
                experience_level: position.experience_level || 'Entry-Level',
                match_score: Math.min(Math.max(position.match_score || 75, 70), 95), // Ensure realistic match scores
                position_summary: position.position_summary || 'Great opportunity for fresh graduates to start their career',
                role_description: position.role_description || 'Exciting entry-level position with growth opportunities',
                key_responsibilities: position.key_responsibilities || ['Learn and grow in the role', 'Contribute to team projects', 'Develop professional skills'],
                required_qualifications: position.required_qualifications || [`${welcome.highestEducation || 'Bachelor\'s degree'} or equivalent`, 'Strong communication skills'],
                required_skills: position.required_skills || ['Communication', 'Teamwork', 'Willingness to learn'],
                skill_development_opportunities: position.skill_development_opportunities || ['Professional communication', 'Industry-specific knowledge', 'Leadership skills'],
                career_growth_path: position.career_growth_path || 'Opportunity to advance to senior roles with experience and skill development',
                work_environment_fit: position.work_environment_fit || `Suitable for ${careerGoals.workEnvironment || userProfile.workEnvironment || 'flexible'} work preferences`,
                career_priorities_alignment: position.career_priorities_alignment || 'Aligns with professional growth and learning opportunities',
                industry_sector: position.industry_sector || 'General Business',
                typical_salary_range: position.typical_salary_range || 'PHP 18,000 - 25,000 / month'
            };
        });

        console.log('✨ Successfully processed all job positions');
        console.log('📈 Final result summary:', {
            totalPositions: jobPositions.length,
            averageMatchScore: Math.round(jobPositions.reduce((sum, pos) => sum + pos.match_score, 0) / jobPositions.length),
            industries: [...new Set(jobPositions.map(pos => pos.industry_sector))],
            experienceLevels: [...new Set(jobPositions.map(pos => pos.experience_level))]
        });

        return {
            success: true,
            job_positions: jobPositions,
            total_positions: jobPositions.length,
            personalized_for: welcome.fullName || 'User'
        };

    } catch (error) {
        console.error('💥 Error generating personalized job positions:', {
            errorMessage: error.message,
            errorStack: error.stack,
            userProfile: {
                hasFullName: !!welcome.fullName,
                majorCourse: welcome.majorCourse || 'not provided'
            }
        });
        
        // Return a fallback response with sample positions tailored to basic profile info
        console.log('🔄 Generating fallback response...');
        
        const fallbackPositions = generateFallbackPositions(userProfile);
        
        console.log('📝 Fallback positions created:', {
            totalPositions: fallbackPositions.length,
            positionTitles: fallbackPositions.map(pos => pos.position_title),
            averageMatchScore: Math.round(fallbackPositions.reduce((sum, pos) => sum + pos.match_score, 0) / fallbackPositions.length),
            basedOnMajor: !!welcome.majorCourse
        });

        return {
            success: false,
            error: error.message,
            job_positions: fallbackPositions,
            total_positions: fallbackPositions.length,
            personalized_for: welcome.fullName || 'User'
        };
    }
}

module.exports = {
    generateJobPositions
};
