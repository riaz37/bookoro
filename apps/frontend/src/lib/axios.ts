import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Extend Axios config to include metadata
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    metadata?: {
        startTime: number;
        timeoutId?: NodeJS.Timeout;
    };
}

const api = axios.create({
    baseURL: API_URL,
});

// Track if we've shown the warming up message
let warmingUpToastId: string | null = null;
let isFirstRequest = true;

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const customConfig = config as CustomAxiosRequestConfig;
    const token = localStorage.getItem('access_token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp for cold start detection
    customConfig.metadata = { startTime: Date.now() };

    // Show warming up message for first request or if it's taking too long
    if (isFirstRequest) {
        const timeoutId = setTimeout(() => {
            if (!warmingUpToastId) {
                warmingUpToastId = toast.loading(
                    '🚀 Waking up the server... This may take 30-60 seconds on first load.',
                    { duration: 60000 }
                );
            }
        }, 2000); // Show after 2 seconds

        // Store timeout ID to clear it if request completes quickly
        customConfig.metadata.timeoutId = timeoutId;
    }

    return config;
});


api.interceptors.response.use(
    (response: AxiosResponse) => {
        const config = response.config as CustomAxiosRequestConfig;

        // Clear timeout if request completed quickly
        if (config.metadata?.timeoutId) {
            clearTimeout(config.metadata.timeoutId);
        }

        // Dismiss warming up toast on successful response
        if (warmingUpToastId) {
            toast.dismiss(warmingUpToastId);
            warmingUpToastId = null;
        }

        // Mark that first request is complete
        if (isFirstRequest) {
            isFirstRequest = false;
            toast.success('Server is ready!', { duration: 2000 });
        }

        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as CustomAxiosRequestConfig & { _retry?: boolean };

        // Clear timeout on error
        if (originalRequest?.metadata?.timeoutId) {
            clearTimeout(originalRequest.metadata.timeoutId);
        }

        // Dismiss warming up toast on error
        if (warmingUpToastId) {
            toast.dismiss(warmingUpToastId);
            warmingUpToastId = null;
        }

        // Mark first request as complete even on error
        if (isFirstRequest) {
            isFirstRequest = false;
        }

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
                    const { data } = await axios.post(`${API_URL}/auth/refresh`, {
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
