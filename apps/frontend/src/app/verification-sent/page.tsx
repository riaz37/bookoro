'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, ArrowRight } from 'lucide-react';

export default function VerificationSentPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [email, setEmail] = useState('');

    useEffect(() => {
        const emailParam = searchParams.get('email');
        if (emailParam) {
            setEmail(emailParam);
        } else {
            // Redirect to signup if no email provided
            router.push('/signup');
        }
    }, [searchParams, router]);

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
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring' }}
                            className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600"
                        >
                            <Mail className="h-10 w-10 text-white" />
                        </motion.div>
                        <h1 className="text-2xl font-bold text-slate-900">Check Your Email</h1>
                        <p className="mt-2 text-sm text-slate-500">
                            We've sent a verification link to
                        </p>
                        <p className="mt-1 font-semibold text-blue-600">{email}</p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-3 rounded-lg bg-blue-50 p-4">
                            <div className="flex items-start gap-3">
                                <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                                <div>
                                    <p className="text-sm font-medium text-slate-900">Click the verification link</p>
                                    <p className="text-xs text-slate-600">Check your inbox and click the link to verify your account</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                                <div>
                                    <p className="text-sm font-medium text-slate-900">Return to login</p>
                                    <p className="text-xs text-slate-600">After verification, you can log in to your account</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <p className="text-center text-xs text-slate-500">
                                Didn't receive the email? Check your spam folder or contact support.
                            </p>

                            <Button
                                onClick={() => router.push('/login')}
                                className="w-full gap-2"
                            >
                                Go to Login
                                <ArrowRight size={16} />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
