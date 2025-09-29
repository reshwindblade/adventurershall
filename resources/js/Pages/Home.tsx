import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Components/Layout/AppLayout';
import { Page, NewsArticle, Event } from '@/types';

interface Props {
    page?: Page;
    recentNews: NewsArticle[];
    upcomingEvents: Event[];
}

export default function Home({ page, recentNews, upcomingEvents }: Props) {
    return (
        <AppLayout>
            <Head title="Welcome to Adventurers' Hall" />
            
            <div className="min-h-screen">
                {/* Hero Section */}
                <section className="relative bg-gradient-primary py-24 lg:py-32">
                    <div className="absolute inset-0 bg-black opacity-60"></div>
                    <div className="relative container-responsive text-center animate-fade-in">
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-tight">
                            Welcome to <span className="text-gradient-pink">Adventurers' Hall</span>
                        </h1>
                        <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
                            Your premier destination for board games, tabletop RPGs, and unforgettable gaming experiences
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
                            <Link
                                href="/book-room"
                                className="btn-primary text-lg px-8 py-4 w-full sm:w-auto"
                            >
                                Book a Room
                            </Link>
                            <Link
                                href="/book-session"
                                className="btn-secondary text-lg px-8 py-4 w-full sm:w-auto"
                            >
                                Book a Session
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-16 lg:py-20 bg-gray-800">
                    <div className="container-responsive">
                        <div className="text-center mb-12 lg:mb-16 animate-fade-in">
                            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
                                What We Offer
                            </h2>
                            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
                                Discover the perfect gaming experience tailored to your preferences
                            </p>
                        </div>
                        
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                            <div className="card text-center p-6 lg:p-8 interactive-hover animate-slide-up">
                                <div className="w-16 h-16 bg-gradient-pink rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <h3 className="text-xl lg:text-2xl font-display font-bold text-white mb-4">Private Gaming Rooms</h3>
                                <p className="text-gray-300 leading-relaxed">
                                    Book our beautifully themed rooms - Rose Garden and Obsidian Sanctuary - for your private gaming sessions.
                                </p>
                            </div>
                            
                            <div className="card text-center p-6 lg:p-8 interactive-hover animate-slide-up" style={{animationDelay: '0.1s'}}>
                                <div className="w-16 h-16 bg-gradient-pink rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <h3 className="text-xl lg:text-2xl font-display font-bold text-white mb-4">TTRPG Sessions</h3>
                                <p className="text-gray-300 leading-relaxed">
                                    Learn different tabletop RPG systems with our experienced instructors. Perfect for beginners and veterans alike.
                                </p>
                            </div>
                            
                            <div className="card text-center p-6 lg:p-8 interactive-hover animate-slide-up sm:col-span-2 lg:col-span-1" style={{animationDelay: '0.2s'}}>
                                <div className="w-16 h-16 bg-gradient-pink rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl lg:text-2xl font-display font-bold text-white mb-4">Community Events</h3>
                                <p className="text-gray-300 leading-relaxed">
                                    Join our regular events, tournaments, and special gaming nights. Connect with fellow adventurers!
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Recent News Section */}
                {recentNews.length > 0 && (
                    <section className="py-16 lg:py-20 bg-gray-900">
                        <div className="container-responsive">
                            <div className="text-center mb-12 lg:mb-16 animate-fade-in">
                                <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
                                    Latest News
                                </h2>
                                <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
                                    Stay updated with the latest happenings at Adventurers' Hall
                                </p>
                            </div>
                            
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                                {recentNews.map((article, index) => (
                                    <article key={article.id} className="card overflow-hidden interactive-hover animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                                        {article.featured_image && (
                                            <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                                                <img
                                                    src={article.featured_image}
                                                    alt={article.title}
                                                    className="w-full h-48 object-cover lazy-image transition-transform duration-300 hover:scale-105"
                                                    loading="lazy"
                                                />
                                            </div>
                                        )}
                                        <div className="p-6">
                                            <div className="flex items-center text-sm text-gray-400 mb-3">
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <time dateTime={article.published_at || ''}>
                                                    {article.published_at ? new Date(article.published_at).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    }) : 'Date not available'}
                                                </time>
                                            </div>
                                            <h3 className="text-lg lg:text-xl font-display font-bold text-white mb-3 line-clamp-2">
                                                <Link
                                                    href={route('news.show', article.slug)}
                                                    className="hover:text-primary-400 transition-colors focus-visible"
                                                >
                                                    {article.title}
                                                </Link>
                                            </h3>
                                            {article.excerpt && (
                                                <p className="text-gray-300 mb-4 line-clamp-3 leading-relaxed">
                                                    {article.excerpt}
                                                </p>
                                            )}
                                            <Link
                                                href={route('news.show', article.slug)}
                                                className="inline-flex items-center text-primary-400 hover:text-primary-300 font-medium transition-colors focus-visible"
                                            >
                                                Read More
                                                <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </article>
                                ))}
                            </div>
                            
                            <div className="text-center mt-12">
                                <Link
                                    href={route('news.index')}
                                    className="btn-primary inline-flex items-center"
                                >
                                    View All News
                                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </section>
                )}

                {/* Upcoming Events Section */}
                {upcomingEvents.length > 0 && (
                    <section className="py-16 lg:py-20 bg-gray-800">
                        <div className="container-responsive">
                            <div className="text-center mb-12 lg:mb-16 animate-fade-in">
                                <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
                                    Upcoming Events
                                </h2>
                                <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
                                    Join us for these exciting gaming events and community activities
                                </p>
                            </div>
                            
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                                {upcomingEvents.map((event, index) => (
                                    <article key={event.id} className="card overflow-hidden interactive-hover animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                                        {event.featured_image && (
                                            <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                                                <img
                                                    src={event.featured_image}
                                                    alt={event.title}
                                                    className="w-full h-48 object-cover lazy-image transition-transform duration-300 hover:scale-105"
                                                    loading="lazy"
                                                />
                                            </div>
                                        )}
                                        <div className="p-6">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center text-sm text-gray-400">
                                                    <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <time dateTime={event.event_date}>
                                                        {new Date(event.event_date).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </time>
                                                </div>
                                                <span className="inline-flex items-center bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full animate-bounce-subtle">
                                                    Upcoming
                                                </span>
                                            </div>
                                            <h3 className="text-lg lg:text-xl font-display font-bold text-white mb-3 line-clamp-2">
                                                <Link
                                                    href={route('events.show', event.slug)}
                                                    className="hover:text-primary-400 transition-colors focus-visible"
                                                >
                                                    {event.title}
                                                </Link>
                                            </h3>
                                            <div 
                                                className="text-gray-300 mb-4 line-clamp-3 prose prose-sm max-w-none prose-invert leading-relaxed"
                                                dangerouslySetInnerHTML={{ 
                                                    __html: event.description.length > 100 
                                                        ? event.description.substring(0, 100) + '...' 
                                                        : event.description 
                                                }}
                                            />
                                            <Link
                                                href={route('events.show', event.slug)}
                                                className="inline-flex items-center text-primary-400 hover:text-primary-300 font-medium transition-colors focus-visible"
                                            >
                                                Learn More
                                                <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </article>
                                ))}
                            </div>
                            
                            <div className="text-center mt-12">
                                <Link
                                    href={route('events.index')}
                                    className="btn-primary inline-flex items-center"
                                >
                                    View All Events
                                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </section>
                )}

                {/* Dynamic Content Section */}
                {page && (
                    <section className="py-16 lg:py-20 bg-gray-900">
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div 
                                className="prose prose-lg max-w-none prose-invert animate-fade-in"
                                dangerouslySetInnerHTML={{ __html: page.content }}
                            />
                        </div>
                    </section>
                )}

                {/* Call to Action */}
                <section className="py-16 lg:py-20 bg-black">
                    <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 animate-fade-in">
                        <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-6">
                            Ready to Start Your Adventure?
                        </h2>
                        <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                            Book your gaming experience today and join our community of adventurers
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
                            <Link
                                href="/contact"
                                className="btn-primary text-lg px-8 py-4 w-full sm:w-auto"
                            >
                                Contact Us
                            </Link>
                            <Link
                                href="/about"
                                className="btn-ghost text-lg px-8 py-4 w-full sm:w-auto"
                            >
                                Learn More
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}