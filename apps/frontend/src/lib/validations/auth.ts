import { z } from 'zod';

// Signup validation schema
export const signupSchema = z.object({
    name: z.string()
        .min(1, 'Name is required')
        .min(2, 'Name must be at least 2 characters'),
    email: z.string()
        .min(1, 'Email is required')
        .email('Invalid email address'),
    password: z.string()
        .min(6, 'Password must be at least 6 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string()
        .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

// Login validation schema
export const loginSchema = z.object({
    email: z.string()
        .min(1, 'Email is required')
        .email('Invalid email address'),
    password: z.string()
        .min(1, 'Password is required'),
});

export type SignupFormData = z.infer<typeof signupSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
