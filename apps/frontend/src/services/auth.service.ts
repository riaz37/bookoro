import api from '@/lib/axios';

export const authService = {
    async login(email: string, pass: string) {
        const res = await api.post('/auth/login', { email, password: pass });
        return res.data;
    },

    async signup(name: string, email: string, pass: string) {
        const res = await api.post('/auth/signup', { name, email, password: pass });
        return res.data;
    },

    async verify(email: string, otp: string) {
        const res = await api.post('/auth/verify', { email, otp });
        return res.data;
    },

    async resendOtp(email: string) {
        const res = await api.post('/auth/resend-otp', { email });
        return res.data;
    },

    async getProfile() {
        return null;
    }
};
