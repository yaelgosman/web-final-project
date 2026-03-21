import axios from 'axios';

const apiClient = axios.create({
    // TODO: Replace with the actual backend URL
    baseURL: 'http://localhost:3000',
    // headers: {
    //     'Content-Type': 'application/json',
    // },
    timeout: 10000,
});

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

// This runs when a response is received. useful for handling global errors like 401 (Unauthorized)
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // if we got 401 and it's not a request we already tried to refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) throw new Error("No refresh token");

                // call server to get new access token
                const res = await axios.post(`${apiClient.defaults.baseURL}/api/auth/refresh`, { refreshToken });

                const { accessToken, refreshToken: newRefreshToken } = res.data;

                // update the storage
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', newRefreshToken);

                // update the header and retry the original request
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                // if the refresh failed (expired), log the user out
                localStorage.clear();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;