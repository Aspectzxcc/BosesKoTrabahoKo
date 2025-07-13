const { Groq } = require('groq-sdk');
const { config } = require('../utils/config/index');

const groq = new Groq({
    apiKey: config.groqApiKey,
})

const jobListerPrompt = `
### Role
You are an expert AI career advisor and job lister for "Boses Ko Trabaho Ko," specializing in curating suitable job opportunities for undergraduate students and recent graduates with limited professional experience.

### Context
You are tasked with generating realistic job postings that align with the core purpose of "Boses Ko Trabaho Ko": to intelligently guide young individuals towards suitable job opportunities. The jobs generated should reflect entry-level positions, internships, or roles appropriate for someone building their career foundation, and be relevant to typical fields pursued by undergrads/fresh grads.

### Task
Generate a list of highly relevant, AI-curated job opportunities, suitable for the target audience. Each job entry must provide comprehensive details necessary for both a concise overview (like a job card) and a detailed job description screen within the "Boses Ko Trabaho Ko" web application.

### Instructions
- The output must be a JSON object with a single root key: "job_listings".
- The value of "job_listings" must be a JSON array.
- This array must contain multiple JSON objects, each representing a unique job posting.
- Each job object must contain the following keys and appropriate values:
  - "job_id": A unique string identifier for the job (e.g., "uuid_string_123").
  - "job_title": The full title of the job position (e.g., "Junior Marketing Assistant", "Entry-Level Software Developer").
  - "company_name": The name of the company offering the job.
  - "company_logo_url": A placeholder URL for the company's logo (e.g., "https://example.com/logo/company.png").
  - "location": The geographic location of the job (e.g., "Manila, Philippines", "Remote", "Cebu City").
  - "job_type": The type of employment (e.g., "Full-time", "Internship", "Part-time", "Contract").
  - "experience_level": The required experience level (e.g., "Entry-Level", "No Experience Required", "Internship").
  - "match_score": An integer percentage (0-100) indicating the AI's confidence in the job's relevance to an average undergrad/fresh grad profile (e.g., 85).
  - "posted_date": The date the job was notionally posted (YYYY-MM-DD format).
  - "summary": A concise, 1-2 sentence overview of the job, suitable for a job card.
  - "full_description": A detailed paragraph describing the overall role and its context.
  - "responsibilities": A JSON array of strings, each representing a key responsibility of the role.
  - "qualifications": A JSON array of strings, each representing a required academic qualification or general experience.
  - "required_skills": A JSON array of strings, listing the key skills (both hard and soft) necessary for the role.
  - "company_overview": A brief paragraph describing the company.
  - "company_website_url": A placeholder URL for the company's official website (e.g., "https://example.com/company-name").
  - "apply_now_url": A placeholder URL where a user could nominally apply (e.g., "https://example.com/apply/job-id").
  - "schedule": The typical work schedule (e.g., "Monday-Friday", "Flexible", "Shift-based").
  - "department": The department or team the role belongs to (e.g., "Sales", "Engineering", "Human Resources").
  - "salary_range": An estimated salary range or status (e.g., "PHP 20,000 - 25,000 / month", "Competitive", "Paid Internship").

### Constraints
- Generate a minimum of 3 and a maximum of 5 distinct job listings.
- Ensure all generated jobs are genuinely suitable for individuals with limited professional experience.
- The "match_score" should generally be high (e.g., 70% or above) as these are "AI-curated" relevant jobs.
- All URLs should be placeholder examples.
- Your entire response must be a single, valid JSON object starting with { and ending with }.
- DO NOT include any explanatory text or markdown outside of the JSON object.
`;

async function generateJobPositionList(userProfile = {}) {
    try {
        // Create a user context from the provided profile
        const userContext = 
        `
        User Profile Context:
        - Major/Course: ${userProfile.major || 'General'}
        - Education Level: ${userProfile.educationLevel || 'Undergraduate'}
        - Skills: ${userProfile.skills ? userProfile.skills.join(', ') : 'Basic computer skills'}
        - Career Interests: ${userProfile.careerInterests || 'Open to various opportunities'}
        - Work Environment Preference: ${userProfile.workEnvironment || 'Flexible'}
        - Location Preference: ${userProfile.location || 'Philippines'}

        Please generate relevant job listings for this user profile.
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
            "temperature": 0.3,
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

        // Return the job listings with some basic validation
        const jobListings = aiResponse.job_listings.map((job, index) => {
            // Ensure required fields exist with fallbacks
            return {
                job_id: job.job_id || `job_${Date.now()}_${index}`,
                job_title: job.job_title || 'Entry-Level Position',
                company_name: job.company_name || 'Company Name',
                company_logo_url: job.company_logo_url || 'https://example.com/logo/default.png',
                location: job.location || 'Philippines',
                job_type: job.job_type || 'Full-time',
                experience_level: job.experience_level || 'Entry-Level',
                match_score: job.match_score || 75,
                posted_date: job.posted_date || new Date().toISOString().split('T')[0],
                summary: job.summary || 'Great opportunity for fresh graduates',
                full_description: job.full_description || 'Detailed job description not available',
                responsibilities: job.responsibilities || ['Learn and grow in the role'],
                qualifications: job.qualifications || ['Bachelor\'s degree or equivalent'],
                required_skills: job.required_skills || ['Communication skills', 'Willingness to learn'],
                company_overview: job.company_overview || 'Growing company with opportunities for development',
                company_website_url: job.company_website_url || 'https://example.com',
                apply_now_url: job.apply_now_url || 'https://example.com/apply',
                schedule: job.schedule || 'Monday-Friday',
                department: job.department || 'General',
                salary_range: job.salary_range || 'Competitive'
            };
        });

        return {
            success: true,
            job_listings: jobListings,
            total_jobs: jobListings.length
        };

    } catch (error) {
        console.error('Error generating job listings:', error);
        
        // Return a fallback response with sample jobs
        return {
            success: false,
            error: error.message,
            job_listings: [
                {
                    job_id: `fallback_${Date.now()}`,
                    job_title: 'Entry-Level Assistant',
                    company_name: 'Growing Company',
                    company_logo_url: 'https://example.com/logo/default.png',
                    location: 'Manila, Philippines',
                    job_type: 'Full-time',
                    experience_level: 'Entry-Level',
                    match_score: 80,
                    posted_date: new Date().toISOString().split('T')[0],
                    summary: 'Great starting position for fresh graduates',
                    full_description: 'An excellent opportunity to begin your career with a supportive team.',
                    responsibilities: ['Learn company processes', 'Assist with daily operations', 'Participate in training programs'],
                    qualifications: ['Bachelor\'s degree', 'Good communication skills'],
                    required_skills: ['MS Office', 'Communication', 'Teamwork'],
                    company_overview: 'A dynamic company focused on employee growth and development.',
                    company_website_url: 'https://example.com',
                    apply_now_url: 'https://example.com/apply',
                    schedule: 'Monday-Friday',
                    department: 'Operations',
                    salary_range: 'PHP 18,000 - 22,000 / month'
                }
            ],
            total_jobs: 1
        };
    }
}

module.exports = {
    generateJobPositionList
};
