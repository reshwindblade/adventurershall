import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Components/Layout/AppLayout';
import EnhancedContactForm from '@/Components/Forms/EnhancedContactForm';

export default function Contact() {

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
                            <EnhancedContactForm />

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