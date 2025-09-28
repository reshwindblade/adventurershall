import React, { FormEvent, useState } from 'react';
import { router } from '@inertiajs/react';
import Button from '../UI/Button';

interface ForgotPasswordFormProps {
    errors: Record<string, string>;
    status?: string;
}

export default function ForgotPasswordForm({ errors, status }: ForgotPasswordFormProps) {
    const [email, setEmail] = useState('');
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        router.post('/forgot-password', { email }, {
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
                Reset Your Password
            </h2>

            <p className="text-sm text-gray-600 text-center mb-6">
                Enter your email address and we'll send you a link to reset your password.
            </p>

            {status && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-600">{status}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${
                            errors.email ? 'border-red-300' : 'border-gray-300'
                        }`}
                        required
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                </div>

                <Button
                    type="submit"
                    disabled={processing}
                    className="w-full"
                >
                    {processing ? 'Sending Reset Link...' : 'Send Reset Link'}
                </Button>
            </form>

            <div className="mt-6 text-center">
                <a href="/login" className="text-sm text-pink-600 hover:text-pink-500">
                    Back to Sign In
                </a>
            </div>
        </div>
    );
}