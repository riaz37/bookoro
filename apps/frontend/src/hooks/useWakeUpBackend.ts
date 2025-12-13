import { useEffect } from 'react';
import api from '@/lib/axios';

/**
 * Hook to wake up the backend server on mount
 * Useful for Render free tier cold starts
 */
export function useWakeUpBackend() {
    useEffect(() => {
        // Make a lightweight health check request to wake up the backend
        const wakeUp = async () => {
            try {
                // Hit the health endpoint to wake up the server
                await api.get('/health').catch(() => {
                    // Silently fail - the main goal is to wake up the server
                    // The axios interceptor will handle showing the warming up message
                });
            } catch (error) {
                // Ignore errors - we just want to wake up the server
            }
        };

        wakeUp();
    }, []);
}
