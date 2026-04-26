import axios from 'axios';

const apiClient = axios.create({
    // Retrieves the backend URL from the .env file, or falls back to localhost for development
    baseURL: import.meta.env.VITE_API_BASE_URL || window.location.origin,
    // headers: {
    //     'Content-Type': 'application/json',
    // },
    timeout: 30000,
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
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // if we got 401 and it's not a request we already tried to refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers['Authorization'] = 'Bearer ' + token;
                        return apiClient(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) throw new Error("No refresh token");

                // call server to get new access token
                const res = await axios.post(`${apiClient.defaults.baseURL}/api/auth/refresh`, { refreshToken });

                const { accessToken, refreshToken: newRefreshToken } = res.data;

                // update the storage
                localStorage.setItem('token', accessToken);
                localStorage.setItem('refreshToken', newRefreshToken);

                // update the header and retry the original request
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                processQueue(null, accessToken);
                return apiClient(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                // if the refresh failed (expired), log the user out
                localStorage.clear();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;