import React, { FormEvent, useState } from 'react';
import { router } from '@inertiajs/react';
import Button from '../UI/Button';

interface ResetPasswordFormProps {
    token: string;
    email: string;
    errors: Record<string, string>;
}

export default function ResetPasswordForm({ token, email, errors }: ResetPasswordFormProps) {
    const [data, setData] = useState({
        token,
        email,
        password: '',
        password_confirmation: '',
    });
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        router.post('/reset-password', data, {
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
                Reset Your Password
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={data.email}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
                        disabled
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData({ ...data, password: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${
                            errors.password ? 'border-red-300' : 'border-gray-300'
                        }`}
                        required
                    />
                    {errors.password && (
                        <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                    </label>
                    <input
                        id="password_confirmation"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData({ ...data, password_confirmation: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${
                            errors.password_confirmation ? 'border-red-300' : 'border-gray-300'
                        }`}
                        required
                    />
                    {errors.password_confirmation && (
                        <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>
                    )}
                </div>

                <Button
                    type="submit"
                    disabled={processing}
                    className="w-full"
                >
                    {processing ? 'Resetting Password...' : 'Reset Password'}
                </Button>
            </form>
        </div>
    );
}