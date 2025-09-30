import React from 'react';
import { usePage } from '@inertiajs/react';
import ValidatedForm from './ValidatedForm';
import { Input, Button, Alert } from '../UI';
import { SocialLogin } from '../Auth/SocialLogin';
import { commonValidationRules } from '../../utils/validation';

interface LoginFormProps {
    status?: string;
}

export default function EnhancedLoginForm({ status }: LoginFormProps) {
    const { errors: pageErrors } = usePage().props as any;

    const validationRules = {
        email: commonValidationRules.email,
        password: {
            required: true,
            minLength: 1, // For login, we don't enforce password complexity
        },
    };

    const initialData = {
        email: '',
        password: '',
        remember: false,
    };

    return (
        <div className="w-full animate-fade-in">
            <h2 className="text-2xl font-display font-bold text-center text-white mb-6">
                Sign In to Your Account
            </h2>

            {status && (
                <Alert type="success" className="mb-6">
                    {status}
                </Alert>
            )}

            {pageErrors?.social && (
                <Alert type="error" className="mb-6">
                    {pageErrors.social}
                </Alert>
            )}

            <ValidatedForm
                action="/login"
                method="post"
                validationRules={validationRules}
                initialData={initialData}
                validateOnChange={false} // Don't validate on change for login
            >
                {({ data, errors, processing, setData }) => (
                    <div className="space-y-6">
                        <Input
                            label="Email Address"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            error={errors.email}
                            placeholder="Enter your email"
                            required
                            validateOnBlur={true}
                            onValidate={(value) => {
                                if (!value.trim()) return 'Email address is required to sign in.';
                                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                if (!emailRegex.test(value)) return 'Please enter a valid email address.';
                                return null;
                            }}
                        />

                        <Input
                            label="Password"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            error={errors.password}
                            placeholder="Enter your password"
                            required
                            validateOnBlur={true}
                            onValidate={(value) => {
                                if (!value.trim()) return 'Password is required to sign in.';
                                return null;
                            }}
                        />

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 bg-gray-700 border-gray-600 rounded"
                                />
                                <label htmlFor="remember" className="ml-2 block text-sm text-gray-300">
                                    Remember me
                                </label>
                            </div>

                            <a
                                href="/forgot-password"
                                className="text-sm text-primary-400 hover:text-primary-300 transition-colors focus-visible"
                            >
                                Forgot your password?
                            </a>
                        </div>

                        {/* Display authentication errors */}
                        {(errors.email || errors.password) && (
                            <Alert type="error">
                                Please check your email and password and try again.
                            </Alert>
                        )}

                        <Button
                            type="submit"
                            disabled={processing}
                            loading={processing}
                            className="w-full"
                            variant="primary"
                        >
                            Sign In
                        </Button>
                    </div>
                )}
            </ValidatedForm>

            <SocialLogin className="mt-6" />

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-300">
                    Don't have an account?{' '}
                    <a href="/register" className="text-primary-400 hover:text-primary-300 font-medium transition-colors focus-visible">
                        Sign up here
                    </a>
                </p>
            </div>
        </div>
    );
}