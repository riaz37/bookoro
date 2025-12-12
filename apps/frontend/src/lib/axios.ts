import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:4000',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Check if error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refresh_token');

            if (refreshToken) {
                try {
                    // Decode refresh token to get userId (JWT payload)
                    const tokenPayload = JSON.parse(atob(refreshToken.split('.')[1]));
                    const userId = tokenPayload.sub;

                    // Attempt to refresh tokens with correct payload structure
                    const { data } = await axios.post('http://localhost:4000/auth/refresh', {
                        refreshToken: refreshToken,
                        userId: userId
                    });

                    localStorage.setItem('access_token', data.access_token);
                    // Update refresh token if returned
                    if (data.refresh_token) {
                        localStorage.setItem('refresh_token', data.refresh_token);
                    }

                    // Update header and retry request
                    originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    // Refresh failed - clean up and redirect to login
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    window.location.href = '/login';
                    // Return a promise that never resolves to prevent downstream error handling
                    // from showing alerts/toasts while the page is reloading
                    return new Promise(() => { });
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
