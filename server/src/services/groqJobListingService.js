const { Groq } = require('groq-sdk');
const { config } = require('../utils/config/index');

const groq = new Groq({
    apiKey: config.groqApiKey,
})

const jobListerPrompt = `
### Role
You are an expert AI career advisor and job lister for "Boses Ko Trabaho Ko," specializing in curating personalized job opportunities for undergraduate students and recent graduates based on their comprehensive profile data.

### Context
You are tasked with generating realistic, highly-personalized job postings that align with a specific user's academic background, skills, career interests, and aspirations. The user has completed a detailed onboarding process providing information about their education, current skills (both hard and soft), career interests, dream job, work environment preferences, and career priorities.

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
Generate a list of highly relevant, AI-curated job opportunities that are specifically tailored to the user's profile. Each job should align with their skills, interests, education level, and career aspirations while being appropriate for their experience level.

### Personalization Requirements
- Prioritize jobs that match the user's stated career interests and dream job direction
- Include positions that utilize their existing hard and soft skills
- Consider their work environment preferences when setting location/remote options
- Align job benefits and culture with their stated career priorities
- Ensure experience requirements match their education level and graduation timeline
- Factor in their major/course when relevant to the position

### Instructions
- The output must be a JSON object with a single root key: "job_listings".
- The value of "job_listings" must be a JSON array.
- This array must contain between 3-5 JSON objects, each representing a unique job posting.
- Each job object must contain the following keys and appropriate values:
  - "job_id": A unique string identifier for the job (e.g., "job_2024_001").
  - "job_title": The full title of the job position, aligned with user's interests and skill level.
  - "company_name": The name of the company offering the job.
  - "company_logo_url": A placeholder URL for the company's logo (e.g., "https://example.com/logo/company.png").
  - "location": Geographic location that considers user's work environment preference.
  - "job_type": Employment type appropriate for their experience level ("Full-time", "Internship", "Part-time", "Contract").
  - "experience_level": Required experience level matching their profile ("Entry-Level", "No Experience Required", "Internship", "Fresh Graduate").
  - "match_score": An integer percentage (70-95) indicating relevance to the specific user profile.
  - "posted_date": Recent posting date in YYYY-MM-DD format.
  - "summary": A concise, compelling overview that highlights why this job suits the user.
  - "full_description": A detailed paragraph describing the role and its appeal to this specific user.
  - "responsibilities": Array of key responsibilities that align with user's skills and interests.
  - "qualifications": Array of requirements that match the user's education level and background.
  - "required_skills": Array of skills prioritizing those the user already possesses, with some growth opportunities.
  - "company_overview": Company description that appeals to the user's career priorities and values.
  - "company_website_url": Placeholder URL for the company's website.
  - "apply_now_url": Placeholder URL for job application.
  - "schedule": Work schedule that aligns with their work environment preference.
  - "department": Relevant department based on their interests and major.
  - "salary_range": Appropriate compensation for entry-level in the Philippines job market.

### Constraints
- Generate 3-5 distinct job listings that offer variety while staying relevant to the user
- Match scores should reflect actual alignment with user profile (higher scores for better matches)
- Ensure jobs are realistic for the Philippine job market and entry-level candidates
- Include a mix of industries if user has diverse interests, or focus on specific area if clearly defined
- All URLs should be placeholder examples
- Response must be valid JSON only, no additional text or markdown
- Consider seasonal timing and current market trends for realistic posting dates
`;

async function generateJobPositionList(userProfile = {}) {
    try {
        // Create a comprehensive user context from the provided profile
        const userContext = 
        `
        ### USER PROFILE DATA ###
        
        **Basic Information:**
        - Full Name: ${userProfile.fullName || 'Not provided'}
        - Major/Course: ${userProfile.majorCourse || 'General studies'}
        - Highest Education: ${userProfile.highestEducation || 'Undergraduate'}
        - Graduation Year: ${userProfile.graduationYear || 'Recent graduate'}
        
        **Technical & Hard Skills:**
        ${userProfile.hardSkills && userProfile.hardSkills.length > 0 
            ? userProfile.hardSkills.map(skill => `- ${skill}`).join('\n')
            : '- Basic computer skills\n- Communication\n- Willingness to learn'
        }
        
        **Soft Skills & Personal Qualities:**
        ${userProfile.softSkills && userProfile.softSkills.length > 0
            ? userProfile.softSkills.map(skill => `- ${skill}`).join('\n')
            : '- Communication\n- Teamwork\n- Adaptability'
        }
        
        **Career Interests & Industries:**
        ${userProfile.careerInterests || 'Open to various opportunities in different industries'}
        
        **Dream Job/Career Aspiration:**
        ${userProfile.dreamJob || 'Seeking entry-level opportunities to build career foundation'}
        
        **Work Environment Preference:**
        ${userProfile.workEnvironment || 'Flexible work arrangements'}
        
        **Career Priorities & Values:**
        ${userProfile.careerPriorities && userProfile.careerPriorities.length > 0
            ? userProfile.careerPriorities.map(priority => `- ${priority.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`).join('\n')
            : '- Learning opportunities\n- Career growth\n- Work-life balance'
        }
        
        **Location Preference:**
        ${userProfile.location || 'Philippines (flexible location)'}
        
        ### PERSONALIZATION INSTRUCTIONS ###
        Based on this comprehensive profile, generate job listings that:
        1. Align with their stated career interests and dream job direction
        2. Utilize their existing hard and soft skills while offering growth opportunities
        3. Match their work environment preferences
        4. Reflect their career priorities and values in job benefits and company culture
        5. Are appropriate for their education level and experience
        6. Consider their major/course background when relevant
        7. Provide realistic opportunities in the Philippine job market
        
        Generate highly personalized, relevant job recommendations for this specific user.
        `
        .trim();

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
        
        if (!jsonStringResponse) {
            throw new Error('No response received from AI service');
        }

        const aiResponse = JSON.parse(jsonStringResponse);
        
        // Validate the response structure
        if (!aiResponse.job_listings || !Array.isArray(aiResponse.job_listings)) {
            throw new Error('Invalid response format: missing or invalid job_listings array');
        }

        // Return the job listings with enhanced validation and fallbacks
        const jobListings = aiResponse.job_listings.map((job, index) => {
            // Ensure required fields exist with intelligent fallbacks based on user profile
            return {
                job_id: job.job_id || `job_${Date.now()}_${index}`,
                job_title: job.job_title || 'Entry-Level Position',
                company_name: job.company_name || 'Growing Company',
                company_logo_url: job.company_logo_url || 'https://example.com/logo/default.png',
                location: job.location || (userProfile.workEnvironment === 'Remote' ? 'Remote' : 'Philippines'),
                job_type: job.job_type || 'Full-time',
                experience_level: job.experience_level || 'Entry-Level',
                match_score: Math.min(Math.max(job.match_score || 75, 70), 95), // Ensure realistic match scores
                posted_date: job.posted_date || new Date().toISOString().split('T')[0],
                summary: job.summary || 'Great opportunity for fresh graduates to start their career',
                full_description: job.full_description || 'Exciting entry-level position with growth opportunities',
                responsibilities: job.responsibilities || ['Learn and grow in the role', 'Contribute to team projects', 'Develop professional skills'],
                qualifications: job.qualifications || [`${userProfile.highestEducation || 'Bachelor\'s degree'} or equivalent`, 'Strong communication skills'],
                required_skills: job.required_skills || ['Communication', 'Teamwork', 'Willingness to learn'],
                company_overview: job.company_overview || 'Dynamic company focused on employee growth and development',
                company_website_url: job.company_website_url || 'https://example.com',
                apply_now_url: job.apply_now_url || 'https://example.com/apply',
                schedule: job.schedule || (userProfile.workEnvironment === 'Flexible' ? 'Flexible schedule' : 'Monday-Friday'),
                department: job.department || 'General',
                salary_range: job.salary_range || 'PHP 18,000 - 25,000 / month'
            };
        });

        return {
            success: true,
            job_listings: jobListings,
            total_jobs: jobListings.length,
            personalized_for: userProfile.fullName || 'User'
        };

    } catch (error) {
        console.error('Error generating personalized job listings:', error);
        
        // Return a fallback response with sample jobs tailored to basic profile info
        const fallbackTitle = userProfile.majorCourse 
            ? `${userProfile.majorCourse} Graduate Position`
            : 'Entry-Level Assistant';
            
        const fallbackSkills = userProfile.hardSkills && userProfile.hardSkills.length > 0
            ? userProfile.hardSkills.slice(0, 3)
            : ['MS Office', 'Communication', 'Teamwork'];

        return {
            success: false,
            error: error.message,
            job_listings: [
                {
                    job_id: `fallback_${Date.now()}`,
                    job_title: fallbackTitle,
                    company_name: 'Growing Company',
                    company_logo_url: 'https://example.com/logo/default.png',
                    location: userProfile.workEnvironment === 'Remote' ? 'Remote' : 'Manila, Philippines',
                    job_type: 'Full-time',
                    experience_level: 'Entry-Level',
                    match_score: 80,
                    posted_date: new Date().toISOString().split('T')[0],
                    summary: `Great starting position for ${userProfile.majorCourse || 'fresh graduates'}`,
                    full_description: 'An excellent opportunity to begin your career with a supportive team.',
                    responsibilities: ['Learn company processes', 'Assist with daily operations', 'Participate in training programs'],
                    qualifications: [userProfile.highestEducation || 'Bachelor\'s degree', 'Good communication skills'],
                    required_skills: fallbackSkills,
                    company_overview: 'A dynamic company focused on employee growth and development.',
                    company_website_url: 'https://example.com',
                    apply_now_url: 'https://example.com/apply',
                    schedule: userProfile.workEnvironment === 'Flexible' ? 'Flexible schedule' : 'Monday-Friday',
                    department: 'Operations',
                    salary_range: 'PHP 18,000 - 22,000 / month'
                }
            ],
            total_jobs: 1,
            personalized_for: userProfile.fullName || 'User'
        };
    }
}

module.exports = {
    generateJobPositionList
};
