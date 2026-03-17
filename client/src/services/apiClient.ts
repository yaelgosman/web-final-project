import axios from 'axios';
import { BASE_URL } from '../constants/server';

const apiClient = axios.create({
    // TODO: Replace with the actual backend URL
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // Optional: 10 seconds timeout
});

// --- Request Interceptor ---
// This runs before every request is sent.
apiClient.interceptors.request.use(
    (config) => {
        // Retrieve the token from local storage
        const token = localStorage.getItem('token');

        // If a token exists, add it to the Authorization header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// --- Response Interceptor ---
// This runs when a response is received. useful for handling global errors like 401 (Unauthorized)
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // For example: If the token is invalid (401), log the user out
        if (error.response && error.response.status === 401) {
            console.error('Unauthorized! Redirecting to login...');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // for debugging: You might want to trigger a redirect here or use a global event
            // window.location.href = '/login'; 
        }
        return Promise.reject(error);
    }
);

export default apiClient;