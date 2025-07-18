import axios from 'axios';

const BASE_URL = '/api';

// Create an axios instance with default headers
const api = axios.create({
    baseURL: BASE_URL
});

// Add response interceptor to handle the API response properly
api.interceptors.response.use(
    (response) => {
        // Return the data directly for successful responses
        return response.data;
    },
    (error) => {
        // Handle errors appropriately
        console.error('API Error:', error);
        throw error;
    }
);

export const getJobListings = (userProfile, isRefresh = false) => api.post('/jobs/generate-jobs', { userProfile, isRefresh });

export const validateCourse = (courseMajor) => api.post('/jobs/validate-course', { courseMajor });

export default api;