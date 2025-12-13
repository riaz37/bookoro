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

    async getProfile() {
        const res = await api.get('/auth/me');
        return res.data;
    }
};
