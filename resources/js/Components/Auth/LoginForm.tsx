import React, { FormEvent, useState } from 'react';
import { router } from '@inertiajs/react';
import Button from '../UI/Button';
import { SocialLogin } from './SocialLogin';

interface LoginFormProps {
    errors: Record<string, string>;
    status?: string;
}

export default function LoginForm({ errors, status }: LoginFormProps) {
    const [data, setData] = useState({
        email: '',
        password: '',
        remember: false,
    });
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        router.post('/login', data, {
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
                Sign In to Your Account
            </h2>

            {status && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-600">{status}</p>
                </div>
            )}

            {errors.social && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{errors.social}</p>
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
                        value={data.email}
                        onChange={(e) => setData({ ...data, email: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${
                            errors.email ? 'border-red-300' : 'border-gray-300'
                        }`}
                        required
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        Password
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

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            id="remember"
                            type="checkbox"
                            checked={data.remember}
                            onChange={(e) => setData({ ...data, remember: e.target.checked })}
                            className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                        />
                        <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                            Remember me
                        </label>
                    </div>

                    <a
                        href="/forgot-password"
                        className="text-sm text-pink-600 hover:text-pink-500"
                    >
                        Forgot your password?
                    </a>
                </div>

                <Button
                    type="submit"
                    disabled={processing}
                    className="w-full"
                >
                    {processing ? 'Signing In...' : 'Sign In'}
                </Button>
            </form>

            <SocialLogin className="mt-6" />

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <a href="/register" className="text-pink-600 hover:text-pink-500 font-medium">
                        Sign up here
                    </a>
                </p>
            </div>
        </div>
    );
}