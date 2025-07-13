# Boses Ko Trabaho Ko - Course Validation API Test
# Test suite for the course validation endpoint

# Test: Valid Course - Computer Science
POST http://localhost:3000/api/jobs/validate-course
Content-Type: application/json

{
  "courseMajor": "Computer Science"
}

HTTP 200
[Asserts]
jsonpath "$.isValid" == true
jsonpath "$.confidence" exists
jsonpath "$.normalizedName" exists
jsonpath "$.category" exists
jsonpath "$.reasoning" exists
