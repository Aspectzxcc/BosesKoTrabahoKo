const { Groq } = require('groq-sdk');
const { config } = require('../utils/config');
const { generateFallbackPositions } = require('../utils/fallbackTemplates');

const groq = new Groq({
    apiKey: config.groqApiKey,
})

const jobListerPrompt = `
### Role
You are an expert AI career advisor for "Boses Ko Trabaho Ko," specializing in creating HIGHLY PERSONALIZED job position recommendations for Filipino undergraduate students and recent graduates. Your expertise lies in matching specific user profiles to realistic, achievable career opportunities in the Philippines job market.

### Critical Mission
Generate job recommendations that feel like they were handpicked by a human career counselor who knows the user personally. Each position must demonstrate clear, logical connections to the user's specific skills, interests, education, and career goals.

### User Profile Structure Analysis
When analyzing the user profile, pay special attention to:
- **Academic Background**: Major/course directly influences suitable industries and roles
- **Skill Portfolio**: Match hard skills to job requirements, soft skills to company culture fit  
- **Career Aspirations**: Dream job indicates long-term direction and motivation
- **Personal Values**: Career priorities reveal what matters most to the individual
- **Work Style**: Environment preferences affect job satisfaction and performance

### Personalization Requirements (MANDATORY)
1. **Direct Skill Utilization**: At least 60% of required skills must match user's existing skills
2. **Educational Relevance**: Positions must logically connect to their major/course of study
3. **Career Path Alignment**: Each role must be a stepping stone toward their stated dream job
4. **Priority Matching**: Job characteristics must align with their top 3 career priorities
5. **Cultural Fit**: Work environment must match their stated preferences
6. **Growth Trajectory**: Clear advancement path that builds toward their aspirations

### Enhanced Instructions
- Generate exactly 10 unique, highly relevant job positions
- Match scores should range 85-99%, with higher scores for better profile alignment
- Each position must include SPECIFIC examples of how it matches the user's profile
- Use the user's actual skills, interests, and goals in descriptions
- Reference their major/course when explaining job relevance
- Include realistic Philippine market salary ranges
- Focus on entry-level positions with clear growth potential

### Output Format Requirements
Return a JSON object with "job_positions" array containing 10 position objects. Each position must have:
- position_id, position_title, experience_level, match_score
- position_summary (explain WHY this specific user would excel)
- role_description (connect to their background and goals)
- key_responsibilities (utilize their existing skills)
- required_qualifications (match their education level)
- required_skills (primarily skills they already have)
- skill_development_opportunities (growth areas)
- career_growth_path (progression toward dream job)
- work_environment_fit (match their preferences)
- career_priorities_alignment (address their stated values)
- industry_sector, typical_salary_range

### Quality Standards
- Each recommendation must feel personally crafted
- Avoid generic descriptions or one-size-fits-all language
- Demonstrate clear understanding of the user's unique profile
- Show logical progression from current state to dream job
- Include specific, actionable career development advice
`;

async function generateJobPositions(userProfile = {}, isRefresh = false) {
    // Extract data from the new nested structure
    const welcome = userProfile.welcome || {};
    const skills = userProfile.skills || {};
    const careerGoals = userProfile.careerGoals || {};
    
    const generationType = isRefresh ? 'REFRESH' : 'INITIAL';
    console.log(`🚀 Starting ${generationType} PERSONALIZED job position generation for user:`, welcome.fullName || 'Anonymous');
    console.log('📋 User profile analysis:', {
        hasBasicInfo: !!(welcome.fullName && welcome.majorCourse),
        hardSkillsCount: skills.selectedHardSkills?.length || 0,
        softSkillsCount: skills.selectedSoftSkills?.length || 0,
        hasCareerInterests: !!userProfile.careerInterests,
        hasDreamJob: !!(careerGoals.dreamJob || userProfile.dreamJob),
        workEnvironment: careerGoals.workEnvironment || userProfile.workEnvironment || 'not specified',
        isRefreshGeneration: isRefresh
    });

    // Validate the course/major if provided
    let courseValidation = null;
    if (welcome.majorCourse && welcome.majorCourse.trim() !== '') {
        console.log('🎓 Validating course/major legitimacy...');
        courseValidation = await validateCourseMajor(welcome.majorCourse);
        
        if (!courseValidation.isValid) {
            console.warn('⚠️ Invalid course detected:', {
                original: welcome.majorCourse,
                reasoning: courseValidation.reasoning,
                suggestions: courseValidation.suggestions
            });
        }
    }

    try {
        // Create a comprehensive user context from the provided profile
        const userContext = 
        `
        ### DETAILED USER PROFILE FOR PERSONALIZED MATCHING ###
        
        **PERSONAL & ACADEMIC FOUNDATION:**
        - Name: ${welcome.fullName || 'Not provided'}
        - Academic Major: ${courseValidation ? courseValidation.normalizedName : (welcome.majorCourse || 'General studies')}
        ${courseValidation ? `- Course Validation: ${courseValidation.isValid ? '✅ LEGITIMATE' : '❌ QUESTIONABLE'} (${courseValidation.confidence} confidence)` : ''}
        ${courseValidation && !courseValidation.isValid ? `- Validation Notes: ${courseValidation.reasoning}` : ''}
        ${courseValidation && courseValidation.category ? `- Academic Category: ${courseValidation.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}` : ''}
        - Education Level: ${welcome.highestEducation || 'Undergraduate'}
        - Graduation Timeline: ${welcome.graduationYear || 'Recent graduate'}
        
        **TECHNICAL COMPETENCIES (Hard Skills):**
        ${skills.selectedHardSkills && skills.selectedHardSkills.length > 0 
            ? skills.selectedHardSkills.map(skill => `✓ ${skill} (EXISTING STRENGTH)`).join('\n')
            : '✓ Basic computer literacy\n✓ Communication\n✓ Willingness to learn'
        }
        
        **PERSONAL STRENGTHS (Soft Skills):**
        ${skills.selectedSoftSkills && skills.selectedSoftSkills.length > 0
            ? skills.selectedSoftSkills.map(skill => `✓ ${skill} (DEMONSTRATED ABILITY)`).join('\n')
            : '✓ Communication\n✓ Teamwork\n✓ Adaptability'
        }
        
        **CAREER PASSION & INTERESTS:**
        ${userProfile.careerInterests || 'Exploring diverse career opportunities across multiple industries'}
        
        **ULTIMATE CAREER ASPIRATION:**
        ${careerGoals.dreamJob || userProfile.dreamJob || 'Building a successful career foundation in entry-level opportunities'}
        
        **PREFERRED WORK SETUP:**
        ${careerGoals.workEnvironment || userProfile.workEnvironment || 'Flexible work arrangements'}
        
        **TOP CAREER VALUES & PRIORITIES:**
        ${careerGoals.selectedGoals && careerGoals.selectedGoals.length > 0
            ? careerGoals.selectedGoals.map(priority => `🎯 ${priority.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} (HIGH PRIORITY)`).join('\n')
            : userProfile.selectedGoals && userProfile.selectedGoals.length > 0
                ? userProfile.selectedGoals.map(priority => `🎯 ${priority.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} (HIGH PRIORITY)`).join('\n')
                : '🎯 Learning Opportunities (HIGH PRIORITY)\n🎯 Career Growth (HIGH PRIORITY)\n🎯 Work-Life Balance (HIGH PRIORITY)'
        }
        
        **GEOGRAPHIC CONTEXT:**
        Philippines job market
        
        ### PERSONALIZATION MANDATE ###
        
        ${isRefresh ? `
        **🔄 REFRESH MODE - GENERATE FRESH ALTERNATIVES:**
        
        This is a REFRESH request. The user wants to see NEW job opportunities different from their previous recommendations. 
        
        REFRESH REQUIREMENTS:
        - Explore DIFFERENT industries or sectors than typical for their major
        - Suggest ALTERNATIVE career paths they might not have considered
        - Include MORE CREATIVE applications of their skills
        - Consider EMERGING fields or modern job roles
        - Introduce STARTUP or entrepreneurial opportunities
        - Suggest CROSS-FUNCTIONAL roles that blend multiple skills
        - Higher creativity and exploration while maintaining personalization
        - Use slightly higher temperature in thinking (more innovative suggestions)
        
        Still maintain strong personalization but be MORE ADVENTUROUS and DIVERSE in recommendations.
        ` : `
        **🎯 INITIAL GENERATION - CORE RECOMMENDATIONS:**
        
        This is the user's FIRST set of recommendations. Focus on:
        - MOST OBVIOUS career paths for their major/background
        - TRADITIONAL entry-level positions in their field
        - SAFEST matches for their skills and education
        - MAINSTREAM companies and established industries
        - CONSERVATIVE but highly relevant opportunities
        `}
        
        You MUST create job recommendations that:
        
        1. **LEVERAGE EXISTING SKILLS**: Use their specific hard and soft skills as primary qualifications
        2. **CONNECT TO EDUCATION**: Show clear relationship between their major/course and the role
        3. **ALIGN WITH ASPIRATIONS**: Each position should be a logical step toward their dream job
        4. **HONOR THEIR VALUES**: Address their specific career priorities and work environment preferences  
        5. **SHOW GROWTH PATH**: Demonstrate how this role leads to career advancement
        6. **BE REALISTIC**: Appropriate for their experience level in Philippine job market
        
        **CRITICAL**: Reference their actual skills, major, and goals in job descriptions. Make it obvious why THIS specific user is perfect for each role.
        
        Generate 10 highly personalized job recommendations that feel hand-selected for this individual.
        `
        .trim();

        console.log('🤖 Sending ENHANCED personalization request to Groq AI');
        console.log('📊 User context analysis:', {
            contextLength: userContext.length,
            skillsDetected: (skills.selectedHardSkills?.length || 0) + (skills.selectedSoftSkills?.length || 0),
            hasSpecificMajor: !!welcome.majorCourse,
            hasClearDreamJob: !!(careerGoals.dreamJob || userProfile.dreamJob),
            hasPriorities: !!(careerGoals.selectedGoals?.length || userProfile.selectedGoals?.length),
            generationMode: isRefresh ? 'REFRESH' : 'INITIAL'
        });
        
        // Adjust AI parameters based on refresh mode
        const aiTemperature = isRefresh ? 0.7 : 0.3; // More creative for refresh
        const aiTopP = isRefresh ? 0.95 : 0.9; // More diverse sampling for refresh
        
        console.log('⚙️ Enhanced AI request parameters:', {
            model: "meta-llama/llama-4-maverick-17b-128e-instruct",
            temperature: aiTemperature,
            max_tokens: 8192, // Increased for 10 positions
            response_format: "json_object",
            mode: isRefresh ? "creative_refresh" : "focused_initial",
            targetPositions: 10
        });

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
            "model": "meta-llama/llama-4-maverick-17b-128e-instruct",
            "temperature": aiTemperature, // Dynamic based on refresh mode
            "max_completion_tokens": 8192, // Increased for 10 positions
            "top_p": aiTopP, // Dynamic sampling based on refresh mode
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
            const processedPosition = {
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

            return processedPosition;
        });

        console.log('✨ Successfully processed all job positions');
        console.log('📈 Final result summary:', {
            totalPositions: jobPositions.length,
            averageMatchScore: Math.round(jobPositions.reduce((sum, pos) => sum + pos.match_score, 0) / jobPositions.length),
            industries: [...new Set(jobPositions.map(pos => pos.industry_sector))],
            experienceLevels: [...new Set(jobPositions.map(pos => pos.experience_level))],
            generationType: isRefresh ? 'REFRESH' : 'INITIAL'
        });

        return {
            success: true,
            job_positions: jobPositions,
            total_positions: jobPositions.length,
            personalized_for: welcome.fullName || 'User',
            generation_type: isRefresh ? 'refresh' : 'initial',
            is_refresh: isRefresh
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
            basedOnMajor: !!welcome.majorCourse,
            generationType: isRefresh ? 'REFRESH_FALLBACK' : 'INITIAL_FALLBACK'
        });

        return {
            success: false,
            error: error.message,
            job_positions: fallbackPositions,
            total_positions: fallbackPositions.length,
            personalized_for: welcome.fullName || 'User',
            generation_type: isRefresh ? 'refresh_fallback' : 'initial_fallback',
            is_refresh: isRefresh
        };
    }
}

// Function to validate course/major legitimacy
async function validateCourseMajor(courseName) {
    if (!courseName || courseName.trim() === '' || courseName.toLowerCase() === 'general studies') {
        return {
            isValid: true,
            confidence: 'medium',
            normalizedName: courseName || 'General Studies',
            category: 'general',
            reasoning: 'General or unspecified course'
        }
    }

    const validationPrompt = `
You are an expert in Philippine higher education and academic programs. Your task is to validate whether a given course/major is legitimate and properly formatted.

### Validation Criteria:
1. **Legitimacy**: Is this a real academic program offered by Philippine universities/colleges?
2. **Proper Naming**: Is the course name properly formatted and spelled correctly?
3. **Recognition**: Is this course recognized by CHED (Commission on Higher Education)?
4. **Category Classification**: What field/category does this course belong to?

### Instructions:
Analyze the course name and return a JSON object with these fields:
- isValid (boolean): true if legitimate course, false if fake/nonsensical
- confidence (string): "high", "medium", or "low" based on certainty
- normalizedName (string): properly formatted/corrected course name
- category (string): field category (e.g., "engineering", "business", "healthcare", "education", "arts", "science", "technology", "social-science")
- reasoning (string): brief explanation of validation decision
- suggestions (array): alternative course names if original seems incorrect

### Examples of Valid Courses:
- "Bachelor of Science in Computer Science"
- "Bachelor of Science in Nursing" 
- "Bachelor of Arts in Psychology"
- "Bachelor of Science in Civil Engineering"
- "Bachelor of Science in Business Administration"

### Examples of Invalid Courses:
- "Wizard Studies"
- "Dragon Training"
- "Unicorn Management"
- Random gibberish or clearly fictional programs

Course to validate: "${courseName}"
`;

    try {
        console.log('🔍 Validating course/major:', courseName);
        
        const validationResponse = await groq.chat.completions.create({
            "messages": [
                {
                    "role": "system",
                    "content": "You are an expert validator of Philippine academic programs. Respond only with valid JSON."
                },
                {
                    "role": "user", 
                    "content": validationPrompt
                }
            ],
            "model": "meta-llama/llama-4-maverick-17b-128e-instruct",
            "temperature": 0.1, // Low temperature for consistent validation
            "max_completion_tokens": 512,
            "response_format": { "type": "json_object" }
        });

        const validationResult = JSON.parse(validationResponse.choices[0]?.message?.content || '{}');
        
        console.log('✅ Course validation result:', {
            course: courseName,
            isValid: validationResult.isValid,
            confidence: validationResult.confidence,
            normalizedName: validationResult.normalizedName
        });

        return {
            isValid: validationResult.isValid ?? true,
            confidence: validationResult.confidence ?? 'medium',
            normalizedName: validationResult.normalizedName ?? courseName,
            category: validationResult.category ?? 'general',
            reasoning: validationResult.reasoning ?? 'Course validation completed',
            suggestions: validationResult.suggestions ?? []
        };

    } catch (error) {
        console.error('❌ Error validating course:', error.message);
        // Fallback: assume course is valid if validation fails
        return {
            isValid: true,
            confidence: 'low',
            normalizedName: courseName,
            category: 'general',
            reasoning: 'Validation service unavailable - assumed valid',
            suggestions: []
        };
    }
}

module.exports = {
    generateJobPositions,
    validateCourseMajor
};
