import React, { FormEvent, useState } from 'react';
import { router } from '@inertiajs/react';
import Button from '../UI/Button';
import { SocialLogin } from './SocialLogin';

interface RegisterFormProps {
    errors: Record<string, string>;
}

export default function RegisterForm({ errors }: RegisterFormProps) {
    const [data, setData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        router.post('/register', data, {
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
                Create Your Account
            </h2>

            {errors.social && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{errors.social}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={data.name}
                        onChange={(e) => setData({ ...data, name: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${
                            errors.name ? 'border-red-300' : 'border-gray-300'
                        }`}
                        required
                    />
                    {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                        Username
                    </label>
                    <input
                        id="username"
                        type="text"
                        value={data.username}
                        onChange={(e) => setData({ ...data, username: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${
                            errors.username ? 'border-red-300' : 'border-gray-300'
                        }`}
                        required
                    />
                    {errors.username && (
                        <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                    )}
                </div>

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

                <div>
                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password
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
                    {processing ? 'Creating Account...' : 'Create Account'}
                </Button>
            </form>

            <SocialLogin className="mt-6" />

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <a href="/login" className="text-pink-600 hover:text-pink-500 font-medium">
                        Sign in here
                    </a>
                </p>
            </div>
        </div>
    );
}