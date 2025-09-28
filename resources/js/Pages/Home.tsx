import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Components/Layout/AppLayout';
import { Page } from '@/types';

interface Props {
    page?: Page;
}

export default function Home({ page }: Props) {
    return (
        <AppLayout>
            <Head title="Welcome to Adventurers' Hall" />
            
            <div className="min-h-screen bg-white">
                {/* Hero Section */}
                <section className="relative bg-gradient-to-r from-black via-gray-900 to-black py-24">
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                            Welcome to <span className="text-pink-500">Adventurers' Hall</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                            Your premier destination for board games, tabletop RPGs, and unforgettable gaming experiences
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/book-room"
                                className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
                            >
                                Book a Room
                            </a>
                            <a
                                href="/book-session"
                                className="bg-transparent border-2 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
                            >
                                Book a Session
                            </a>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">
                                What We Offer
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Discover the perfect gaming experience tailored to your preferences
                            </p>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center p-8 bg-white rounded-lg shadow-lg">
                                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Private Gaming Rooms</h3>
                                <p className="text-gray-600">
                                    Book our beautifully themed rooms - Rose Garden and Obsidian Sanctuary - for your private gaming sessions.
                                </p>
                            </div>
                            
                            <div className="text-center p-8 bg-white rounded-lg shadow-lg">
                                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">TTRPG Sessions</h3>
                                <p className="text-gray-600">
                                    Learn different tabletop RPG systems with our experienced instructors. Perfect for beginners and veterans alike.
                                </p>
                            </div>
                            
                            <div className="text-center p-8 bg-white rounded-lg shadow-lg">
                                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Community Events</h3>
                                <p className="text-gray-600">
                                    Join our regular events, tournaments, and special gaming nights. Connect with fellow adventurers!
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Dynamic Content Section */}
                {page && (
                    <section className="py-20 bg-white">
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div 
                                className="prose prose-lg max-w-none"
                                dangerouslySetInnerHTML={{ __html: page.content }}
                            />
                        </div>
                    </section>
                )}

                {/* Call to Action */}
                <section className="py-20 bg-black">
                    <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                        <h2 className="text-4xl font-bold text-white mb-6">
                            Ready to Start Your Adventure?
                        </h2>
                        <p className="text-xl text-gray-300 mb-8">
                            Book your gaming experience today and join our community of adventurers
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/contact"
                                className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
                            >
                                Contact Us
                            </a>
                            <a
                                href="/about"
                                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
                            >
                                Learn More
                            </a>
                        </div>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}