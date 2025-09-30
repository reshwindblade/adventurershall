import React from 'react';
import { usePage } from '@inertiajs/react';
import ValidatedForm from './ValidatedForm';
import { Input, Textarea, Button, Alert } from '../UI';
import { commonValidationRules } from '../../utils/validation';

export default function EnhancedContactForm() {
    const { flash } = usePage().props as any;

    const validationRules = {
        name: commonValidationRules.name,
        email: commonValidationRules.email,
        message: commonValidationRules.message,
    };

    const initialData = {
        name: '',
        email: '',
        message: '',
    };

    return (
        <div className="card p-6 lg:p-8 animate-slide-up">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-6">
                Send us a Message
            </h2>
            
            {flash?.success && (
                <Alert type="success" className="mb-6">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">{flash.success}</span>
                    </div>
                </Alert>
            )}

            <ValidatedForm
                action="/contact"
                method="post"
                validationRules={validationRules}
                initialData={initialData}
                validateOnChange={true}
                onSuccess={() => {
                    // Form will be reset automatically by ValidatedForm
                }}
            >
                {({ data, errors, processing, setData }) => (
                    <div className="space-y-6">
                        <Input
                            label="Name"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            error={errors.name}
                            placeholder="Your full name"
                            required
                            validateOnBlur={true}
                            validateOnChange={true}
                            onValidate={(value) => {
                                if (!value.trim()) return 'Name is required.';
                                if (value.length < 2) return 'Name must be at least 2 characters.';
                                if (!/^[a-zA-Z\s'-]+$/.test(value)) return 'Name can only contain letters, spaces, apostrophes, and hyphens.';
                                return null;
                            }}
                        />

                        <Input
                            label="Email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            error={errors.email}
                            placeholder="your.email@example.com"
                            required
                            validateOnBlur={true}
                            validateOnChange={true}
                            onValidate={(value) => {
                                if (!value.trim()) return 'Email address is required.';
                                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                if (!emailRegex.test(value)) return 'Please enter a valid email address.';
                                return null;
                            }}
                        />

                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                                Message <span className="text-red-400">*</span>
                            </label>
                            <textarea
                                id="message"
                                rows={6}
                                value={data.message}
                                onChange={(e) => setData('message', e.target.value)}
                                className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none ${
                                    errors.message ? 'border-red-500' : 'border-gray-600'
                                }`}
                                placeholder="Tell us how we can help you..."
                                required
                            />
                            {errors.message && (
                                <p className="mt-2 text-sm text-red-400 flex items-center">
                                    <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {errors.message}
                                </p>
                            )}
                            <p className="mt-1 text-xs text-gray-400">
                                {data.message.length}/2000 characters
                            </p>
                        </div>

                        <Button
                            type="submit"
                            disabled={processing}
                            loading={processing}
                            className="w-full"
                            variant="primary"
                        >
                            {processing ? 'Sending...' : 'Send Message'}
                        </Button>
                    </div>
                )}
            </ValidatedForm>
        </div>
    );
}