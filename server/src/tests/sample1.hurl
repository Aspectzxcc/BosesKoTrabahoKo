# Boses Ko Trabaho Ko - Job Listing API Test
# Test suite for the job listing generation endpoint

# Test: Complete User Profile - Job Listing Generation
POST http://localhost:3000/api/jobs
Content-Type: application/json

{
  "userProfile": {
    "welcome": {
      "fullName": "Michael Jordan",
      "majorCourse": "Computer Science",
      "highestEducation": "Bachelor's Degree",
      "graduationYear": "2024"
    },
    "skills": {
      "selectedHardSkills": ["Microsoft Office", "JavaScript", "Python", "Web Development"],
      "selectedSoftSkills": ["Communication", "Teamwork", "Problem Solving"]
    },
    "careerGoals": {
      "dreamJob": "Software Engineer at Google",
      "workEnvironment": "Hybrid",
      "selectedGoals": ["career-growth", "high-salary", "learning-opportunities"]
    },
    "careerInterests": "Technology, Software Development"
  }
}

HTTP 200
[Asserts]
jsonpath "$.success" exists
jsonpath "$.job_positions" exists
jsonpath "$.total_positions" exists
jsonpath "$.personalized_for" exists