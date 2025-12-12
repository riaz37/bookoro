'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';
import { authService } from '@/services/auth.service';

interface User {
    id: string;
    email: string;
    name?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, pass: string) => Promise<void>;
    signup: (name: string, email: string, pass: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [initializing, setInitializing] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                setUser({ id: decoded.sub, email: decoded.email, name: decoded.name });
            } catch (e) {
                console.error('Invalid token', e);
                localStorage.removeItem('access_token');
            }
        }
        setInitializing(false);
    }, []);

    const login = async (email: string, pass: string) => {
        setLoading(true);
        try {
            const { access_token, refresh_token, user } = await authService.login(email, pass);
            localStorage.setItem('access_token', access_token);
            if (refresh_token) localStorage.setItem('refresh_token', refresh_token);
            setUser(user);
            router.push('/flights');
            toast.success('Successfully logged in!');
        } catch (err: any) {
            toast.error(err.response?.data?.message || err.message || 'Invalid credentials');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const signup = async (name: string, email: string, pass: string) => {
        setLoading(true);
        try {
            await authService.signup(name, email, pass);
            toast.success('Account created! Please check your email for verification code.');
        } catch (err: any) {
            toast.error(err.response?.data?.message || err.message || 'Signup failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
        router.push('/login');
        toast.success('Logged out successfully');
    };

    if (initializing) {
        return null; // Or a loading spinner
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
}
