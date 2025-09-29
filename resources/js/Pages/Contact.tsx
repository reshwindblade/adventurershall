import React from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/Components/Layout/AppLayout';
import Button from '@/Components/UI/Button';

interface ContactForm {
    name: string;
    email: string;
    message: string;
}

export default function Contact() {
    const { flash } = usePage().props as any;
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
            
            <div className="min-h-screen">
                {/* Hero Section */}
                <section className="relative bg-gradient-primary py-20 lg:py-24">
                    <div className="absolute inset-0 bg-black opacity-60"></div>
                    <div className="relative container-responsive text-center animate-fade-in">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">
                            Contact <span className="text-gradient-pink">Us</span>
                        </h1>
                        <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                        </p>
                    </div>
                </section>

                {/* Contact Form and Info */}
                <section className="py-16 lg:py-20 bg-gray-900">
                    <div className="container-responsive">
                        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                            {/* Contact Form */}
                            <div className="card p-6 lg:p-8 animate-slide-up">
                                <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-6">Send us a Message</h2>
                                
                                {/* Success Message */}
                                {flash?.success && (
                                    <div className="mb-6 p-4 bg-green-900 border border-green-700 rounded-lg">
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <p className="text-green-300 font-medium">{flash.success}</p>
                                        </div>
                                    </div>
                                )}

                                {/* General Error Message */}
                                {errors.general && (
                                    <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg">
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                            <p className="text-red-300 font-medium">{errors.general}</p>
                                        </div>
                                    </div>
                                )}
                                
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                                            Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                                                errors.name ? 'border-red-500' : 'border-gray-600'
                                            }`}
                                            placeholder="Your full name"
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                                                errors.email ? 'border-red-500' : 'border-gray-600'
                                            }`}
                                            placeholder="your.email@example.com"
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                                            Message *
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
                                        />
                                        {errors.message && (
                                            <p className="mt-1 text-sm text-red-400">{errors.message}</p>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full"
                                        loading={processing}
                                    >
                                        {processing ? 'Sending...' : 'Send Message'}
                                    </Button>
                                </form>
                            </div>

                            {/* Contact Information */}
                            <div className="space-y-8 animate-slide-up" style={{animationDelay: '0.2s'}}>
                                <div>
                                    <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-6">Get in Touch</h2>
                                    <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                                        Whether you're planning your first visit, have questions about our services, 
                                        or want to learn more about hosting an event, we're here to help!
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-800 transition-colors">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 bg-gradient-pink rounded-lg flex items-center justify-center">
                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-display font-semibold text-white">Visit Us</h3>
                                            <p className="text-gray-300 leading-relaxed">
                                                123 Adventure Lane<br />
                                                Gaming District<br />
                                                City, State 12345
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-800 transition-colors">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 bg-gradient-pink rounded-lg flex items-center justify-center">
                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-display font-semibold text-white">Call Us</h3>
                                            <p className="text-gray-300 leading-relaxed">
                                                (555) 123-GAME<br />
                                                Monday - Sunday: 10am - 10pm
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-800 transition-colors">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 bg-gradient-pink rounded-lg flex items-center justify-center">
                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-display font-semibold text-white">Email Us</h3>
                                            <p className="text-gray-300 leading-relaxed">
                                                info@adventurershall.com<br />
                                                We'll respond within 24 hours
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="card p-6 interactive-hover">
                                    <h3 className="text-lg font-display font-semibold text-white mb-3">Quick Questions?</h3>
                                    <p className="text-gray-300 mb-4 leading-relaxed">
                                        Check out our most frequently asked questions or give us a call for immediate assistance.
                                    </p>
                                    <a
                                        href="/faq"
                                        className="text-primary-400 hover:text-primary-300 font-medium transition-colors focus-visible"
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