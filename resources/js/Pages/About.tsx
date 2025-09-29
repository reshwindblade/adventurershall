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
            
            <div className="min-h-screen">
                {/* Hero Section */}
                <section className="relative bg-gradient-primary py-20 lg:py-24">
                    <div className="absolute inset-0 bg-black opacity-60"></div>
                    <div className="relative container-responsive text-center animate-fade-in">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">
                            About <span className="text-gradient-pink">Adventurers' Hall</span>
                        </h1>
                        <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                            Where every game tells a story and every player becomes a legend
                        </p>
                    </div>
                </section>

                {/* Main Content */}
                <section className="py-16 lg:py-20 bg-gray-900">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        {page ? (
                            <div 
                                className="prose prose-lg max-w-none prose-invert animate-fade-in"
                                dangerouslySetInnerHTML={{ __html: page.content }}
                            />
                        ) : (
                            <div className="prose prose-lg max-w-none prose-invert animate-fade-in">
                                <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-6">Our Story</h2>
                                <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                                    Adventurers' Hall was born from a passion for bringing people together through the magic of tabletop gaming. 
                                    We believe that the best adventures happen when friends gather around a table, dice in hand, ready to 
                                    embark on epic quests and create unforgettable memories.
                                </p>
                                
                                <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-6 mt-12">Our Mission</h2>
                                <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                                    To create a welcoming space where both seasoned adventurers and newcomers can discover the joy of 
                                    tabletop gaming. Whether you're looking to learn your first RPG system, host a private game night, 
                                    or join our vibrant community events, we're here to make your gaming dreams come true.
                                </p>
                                
                                <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-6 mt-12">What Makes Us Special</h2>
                                <div className="grid sm:grid-cols-2 gap-6 lg:gap-8 mb-8">
                                    <div className="card p-6 interactive-hover animate-slide-up">
                                        <h3 className="text-lg lg:text-xl font-display font-bold text-white mb-3">Expert Guidance</h3>
                                        <p className="text-gray-300 leading-relaxed">
                                            Our experienced game masters and instructors are passionate about sharing their knowledge 
                                            and helping you discover new gaming systems.
                                        </p>
                                    </div>
                                    <div className="card p-6 interactive-hover animate-slide-up" style={{animationDelay: '0.1s'}}>
                                        <h3 className="text-lg lg:text-xl font-display font-bold text-white mb-3">Premium Spaces</h3>
                                        <p className="text-gray-300 leading-relaxed">
                                            Our themed rooms provide the perfect atmosphere for your adventures, complete with 
                                            comfortable seating and immersive decor.
                                        </p>
                                    </div>
                                    <div className="card p-6 interactive-hover animate-slide-up" style={{animationDelay: '0.2s'}}>
                                        <h3 className="text-lg lg:text-xl font-display font-bold text-white mb-3">Inclusive Community</h3>
                                        <p className="text-gray-300 leading-relaxed">
                                            We welcome players of all experience levels and backgrounds. Everyone has a seat at our table.
                                        </p>
                                    </div>
                                    <div className="card p-6 interactive-hover animate-slide-up" style={{animationDelay: '0.3s'}}>
                                        <h3 className="text-lg lg:text-xl font-display font-bold text-white mb-3">Flexible Options</h3>
                                        <p className="text-gray-300 leading-relaxed">
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
                <section className="py-16 lg:py-20 bg-black">
                    <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 animate-fade-in">
                        <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-6">
                            Join Our Community
                        </h2>
                        <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                            Ready to embark on your next adventure? We can't wait to meet you!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
                            <Link
                                href="/contact"
                                className="btn-primary text-lg px-8 py-4 w-full sm:w-auto"
                            >
                                Get in Touch
                            </Link>
                            <Link
                                href="/events"
                                className="btn-secondary text-lg px-8 py-4 w-full sm:w-auto"
                            >
                                View Events
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}