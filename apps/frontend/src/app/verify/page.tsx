'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { motion } from 'framer-motion';
import { Loader2, Mail, RefreshCw } from 'lucide-react';
import { Suspense } from 'react';

function VerifyOtpContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return; // Only allow digits

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1); // Only keep last character
        setOtp(newOtp);
        setError('');

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);
        if (!/^\d+$/.test(pastedData)) return;

        const newOtp = [...otp];
        pastedData.split('').forEach((char, i) => {
            if (i < 6) newOtp[i] = char;
        });
        setOtp(newOtp);
        inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const otpString = otp.join('');

        if (otpString.length !== 6) {
            setError('Please enter the complete 6-digit code');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await authService.verify(email, otpString);

            // Store tokens for auto-login
            if (response.access_token) {
                localStorage.setItem('access_token', response.access_token);
                localStorage.setItem('refresh_token', response.refresh_token);
                localStorage.setItem('user', JSON.stringify(response.user));
            }

            setSuccess('Email verified successfully! Redirecting...');
            setTimeout(() => {
                window.location.href = '/flights'; // Full reload to trigger auth context
            }, 1500);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResending(true);
        setError('');

        try {
            await authService.resendOtp(email);
            setSuccess('A new code has been sent to your email!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to resend code');
        } finally {
            setResending(false);
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
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-600">
                                <Mail className="h-8 w-8 text-white" />
                            </div>
                            <h1 className="text-gradient text-2xl font-bold">Verify your email</h1>
                            <p className="mt-2 text-sm text-slate-500">
                                We&apos;ve sent a 6-digit code to<br />
                                <span className="font-semibold text-slate-700">{email}</span>
                            </p>
                        </motion.div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="flex justify-center gap-2" onPaste={handlePaste}>
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => { inputRefs.current[index] = el; }}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="h-14 w-12 rounded-xl border-2 border-slate-200 bg-white/50 text-center text-2xl font-bold text-slate-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                    />
                                ))}
                            </div>

                            {error && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center text-sm text-red-600"
                                >
                                    {error}
                                </motion.p>
                            )}

                            {success && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center text-sm text-green-600"
                                >
                                    {success}
                                </motion.p>
                            )}

                            <Button type="submit" className="w-full" size="lg" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    'Verify Email'
                                )}
                            </Button>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    disabled={resending}
                                    className="inline-flex items-center text-sm text-slate-500 hover:text-blue-600 disabled:opacity-50"
                                >
                                    {resending ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <RefreshCw className="mr-2 h-4 w-4" />
                                    )}
                                    Resend code
                                </button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        }>
            <VerifyOtpContent />
        </Suspense>
    );
}
