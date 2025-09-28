import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Components/Layout/AppLayout';
import { Page } from '@/types';

interface Props {
    page?: Page;
}

export default function About({ page }: Props) {
    return (
        <AppLayout>
            <Head title="About Us - Adventurers' Hall" />
            
            <div className="min-h-screen bg-white">
                {/* Hero Section */}
                <section className="relative bg-gradient-to-r from-black via-gray-900 to-black py-20">
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                            About <span className="text-pink-500">Adventurers' Hall</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                            Where every game tells a story and every player becomes a legend
                        </p>
                    </div>
                </section>

                {/* Main Content */}
                <section className="py-20">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        {page ? (
                            <div 
                                className="prose prose-lg max-w-none"
                                dangerouslySetInnerHTML={{ __html: page.content }}
                            />
                        ) : (
                            <div className="prose prose-lg max-w-none">
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
                                <p className="text-lg text-gray-700 mb-6">
                                    Adventurers' Hall was born from a passion for bringing people together through the magic of tabletop gaming. 
                                    We believe that the best adventures happen when friends gather around a table, dice in hand, ready to 
                                    embark on epic quests and create unforgettable memories.
                                </p>
                                
                                <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">Our Mission</h2>
                                <p className="text-lg text-gray-700 mb-6">
                                    To create a welcoming space where both seasoned adventurers and newcomers can discover the joy of 
                                    tabletop gaming. Whether you're looking to learn your first RPG system, host a private game night, 
                                    or join our vibrant community events, we're here to make your gaming dreams come true.
                                </p>
                                
                                <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">What Makes Us Special</h2>
                                <div className="grid md:grid-cols-2 gap-8 mb-8">
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">Expert Guidance</h3>
                                        <p className="text-gray-700">
                                            Our experienced game masters and instructors are passionate about sharing their knowledge 
                                            and helping you discover new gaming systems.
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">Premium Spaces</h3>
                                        <p className="text-gray-700">
                                            Our themed rooms provide the perfect atmosphere for your adventures, complete with 
                                            comfortable seating and immersive decor.
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">Inclusive Community</h3>
                                        <p className="text-gray-700">
                                            We welcome players of all experience levels and backgrounds. Everyone has a seat at our table.
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">Flexible Options</h3>
                                        <p className="text-gray-700">
                                            From private room bookings to guided sessions, we offer flexible options to suit your 
                                            gaming preferences and schedule.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* Call to Action */}
                <section className="py-20 bg-gray-900">
                    <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                        <h2 className="text-4xl font-bold text-white mb-6">
                            Join Our Community
                        </h2>
                        <p className="text-xl text-gray-300 mb-8">
                            Ready to embark on your next adventure? We can't wait to meet you!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/contact"
                                className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
                            >
                                Get in Touch
                            </a>
                            <a
                                href="/events"
                                className="bg-transparent border-2 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
                            >
                                View Events
                            </a>
                        </div>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}