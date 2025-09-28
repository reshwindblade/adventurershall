import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/Components/Layout/AppLayout';
import Button from '@/Components/UI/Button';

interface ContactForm {
    name: string;
    email: string;
    message: string;
}

export default function Contact() {
    const { data, setData, post, processing, errors, reset } = useForm<ContactForm>({
        name: '',
        email: '',
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('contact.store'), {
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Contact Us - Adventurers' Hall" />
            
            <div className="min-h-screen bg-white">
                {/* Hero Section */}
                <section className="relative bg-gradient-to-r from-black via-gray-900 to-black py-20">
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                            Contact <span className="text-pink-500">Us</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                        </p>
                    </div>
                </section>

                {/* Contact Form and Info */}
                <section className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-12">
                            {/* Contact Form */}
                            <div className="bg-white p-8 rounded-lg shadow-lg">
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                                
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                            Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                                                errors.name ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Your full name"
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                                                errors.email ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="your.email@example.com"
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                            Message *
                                        </label>
                                        <textarea
                                            id="message"
                                            rows={6}
                                            value={data.message}
                                            onChange={(e) => setData('message', e.target.value)}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                                                errors.message ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Tell us how we can help you..."
                                        />
                                        {errors.message && (
                                            <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full"
                                    >
                                        {processing ? 'Sending...' : 'Send Message'}
                                    </Button>
                                </form>
                            </div>

                            {/* Contact Information */}
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2>
                                    <p className="text-lg text-gray-700 mb-8">
                                        Whether you're planning your first visit, have questions about our services, 
                                        or want to learn more about hosting an event, we're here to help!
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                                                <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">Visit Us</h3>
                                            <p className="text-gray-600">
                                                123 Adventure Lane<br />
                                                Gaming District<br />
                                                City, State 12345
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                                                <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">Call Us</h3>
                                            <p className="text-gray-600">
                                                (555) 123-GAME<br />
                                                Monday - Sunday: 10am - 10pm
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                                                <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">Email Us</h3>
                                            <p className="text-gray-600">
                                                info@adventurershall.com<br />
                                                We'll respond within 24 hours
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Questions?</h3>
                                    <p className="text-gray-600 mb-4">
                                        Check out our most frequently asked questions or give us a call for immediate assistance.
                                    </p>
                                    <a
                                        href="/faq"
                                        className="text-pink-500 hover:text-pink-600 font-medium"
                                    >
                                        View FAQ →
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}