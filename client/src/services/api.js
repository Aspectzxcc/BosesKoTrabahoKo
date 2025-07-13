import axios from 'axios';

const BASE_URL = '/api';

// Create an axios instance with default headers
const api = axios.create({
    baseURL: BASE_URL
});

export const getJobListings = async () => api.get('/jobs');