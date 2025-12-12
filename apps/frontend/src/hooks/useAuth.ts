import { useAuthContext } from '@/context/AuthContext';

export function useAuth() {
    const { user, loading, login, signup, logout, verifyEmail } = useAuthContext();
    return { user, loading, login, signup, logout, verifyEmail };
}
