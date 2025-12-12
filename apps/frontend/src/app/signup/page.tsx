'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { signupSchema, type SignupFormData } from '@/lib/validations/auth';

export default function SignupPage() {
    const { signup, loading } = useAuth();
    const router = useRouter();
    const [formData, setFormData] = useState<SignupFormData>({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<Partial<Record<keyof SignupFormData, string>>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [serverError, setServerError] = useState('');

    const handleChange = (field: keyof SignupFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError('');
        setErrors({});

        // Validate with Zod
        const result = signupSchema.safeParse(formData);

        if (!result.success) {
            const fieldErrors: Partial<Record<keyof SignupFormData, string>> = {};
            result.error.issues.forEach((err) => {
                if (err.path[0]) {
                    fieldErrors[err.path[0] as keyof SignupFormData] = err.message;
                }
            });
            setErrors(fieldErrors);
            return;
        }

        try {
            await signup(formData.name, formData.email, formData.password);
            // Redirect to OTP verification page
            router.push(`/verify?email=${encodeURIComponent(formData.email)}`);
        } catch (err: any) {
            setServerError(err.message || 'An unexpected error occurred');
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 p-4">
            <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
            <div className="absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-md"
            >
                <Card className="glass border-white/50 bg-white/60">
                    <CardHeader className="text-center">
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h1 className="text-gradient text-3xl font-bold">Bookoro</h1>
                            <p className="mt-2 text-sm text-slate-500">
                                Start your journey with us.
                            </p>
                        </motion.div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Full Name</label>
                                <Input
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange('name')}
                                    placeholder="John Doe"
                                    className="bg-white/50 text-slate-900"
                                />
                                {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Email Address</label>
                                <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange('email')}
                                    placeholder="you@example.com"
                                    className="bg-white/50 text-slate-900"
                                />
                                {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Password</label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={handleChange('password')}
                                        placeholder="••••••••"
                                        className="bg-white/50 text-slate-900 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Confirm Password</label>
                                <div className="relative">
                                    <Input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={formData.confirmPassword}
                                        onChange={handleChange('confirmPassword')}
                                        placeholder="••••••••"
                                        className="bg-white/50 text-slate-900 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.confirmPassword && <p className="text-xs text-red-600">{errors.confirmPassword}</p>}
                            </div>

                            {serverError && <p className="text-sm text-red-600">{serverError}</p>}

                            <Button type="submit" className="w-full" size="lg" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating account...
                                    </>
                                ) : (
                                    'Create Account'
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-sm text-slate-500">
                            Already have an account?{' '}
                            <Link
                                href="/login"
                                className="font-semibold text-blue-600 hover:text-blue-500 hover:underline"
                            >
                                Log in
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
