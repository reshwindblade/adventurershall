import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Components/Layout/AppLayout';
import { Event } from '@/types';

interface Props {
    upcomingEvents: Event[];
    pastEvents: Event[];
}

export default function EventsIndex({ upcomingEvents, pastEvents }: Props) {
    const formatEventDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatEventTime = (timeString: string) => {
        if (!timeString) return '';
        // Handle both full datetime and time-only formats
        const time = timeString.includes('T') ? new Date(timeString) : new Date(`1970-01-01T${timeString}`);
        return time.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const EventCard = ({ event, isPast = false }: { event: Event; isPast?: boolean }) => (
        <article className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow ${isPast ? 'opacity-75' : ''}`}>
            {event.featured_image && (
                <div className="aspect-w-16 aspect-h-9">
                    <img
                        src={event.featured_image}
                        alt={event.title}
                        className={`w-full h-48 object-cover ${isPast ? 'grayscale' : ''}`}
                    />
                </div>
            )}
            <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-sm text-gray-500">
                        <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <time dateTime={event.event_date}>
                            {formatEventDate(event.event_date)}
                        </time>
                        {event.start_time && (
                            <>
                                <span className="mx-2">•</span>
                                <span>{formatEventTime(event.start_time)}</span>
                            </>
                        )}
                    </div>
                    {!isPast && (
                        <span className="inline-flex items-center bg-pink-100 text-pink-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            <svg className="mr-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Upcoming
                        </span>
                    )}
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    <Link
                        href={route('events.show', event.slug)}
                        className="hover:text-pink-500 transition-colors"
                    >
                        {event.title}
                    </Link>
                </h2>
                
                <div 
                    className="text-gray-600 mb-4 line-clamp-3 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ 
                        __html: event.description.length > 150 
                            ? event.description.substring(0, 150) + '...' 
                            : event.description 
                    }}
                />
                
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                        {event.location && (
                            <div className="flex items-center">
                                <svg className="mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>{event.location}</span>
                            </div>
                        )}
                        {event.max_participants && (
                            <div className="flex items-center">
                                <svg className="mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <span>{event.max_participants} max</span>
                            </div>
                        )}
                    </div>
                    
                    <Link
                        href={route('events.show', event.slug)}
                        className="inline-flex items-center text-pink-500 hover:text-pink-600 font-medium"
                    >
                        Learn More
                        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>
        </article>
    );

    return (
        <AppLayout>
            <Head title="Events - Adventurers' Hall" />
            
            <div className="min-h-screen bg-white">
                {/* Hero Section */}
                <section className="relative bg-gradient-to-r from-black via-gray-900 to-black py-20">
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                            Gaming <span className="text-pink-500">Events</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                            Join our community events, tournaments, and special gaming nights
                        </p>
                    </div>
                </section>

                {/* Upcoming Events */}
                <section className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">
                                Upcoming Events
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Don't miss out on these exciting gaming opportunities
                            </p>
                        </div>

                        {upcomingEvents.length > 0 ? (
                            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
                                {upcomingEvents.map((event) => (
                                    <EventCard key={event.id} event={event} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Upcoming Events</h3>
                                <p className="text-gray-600 mb-6">
                                    We're planning some exciting events. Check back soon or contact us for updates!
                                </p>
                                <Link
                                    href={route('contact')}
                                    className="inline-flex items-center bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                >
                                    Contact Us for Updates
                                </Link>
                            </div>
                        )}
                    </div>
                </section>

                {/* Past Events */}
                {pastEvents.length > 0 && (
                    <section className="py-20 bg-gray-50">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-12">
                                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                                    Past Events
                                </h2>
                                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                    Take a look at some of our recent gaming events
                                </p>
                            </div>

                            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
                                {pastEvents.map((event) => (
                                    <EventCard key={event.id} event={event} isPast={true} />
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Call to Action */}
                <section className="py-20 bg-black">
                    <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                        <h2 className="text-4xl font-bold text-white mb-6">
                            Want to Host Your Own Event?
                        </h2>
                        <p className="text-xl text-gray-300 mb-8">
                            Our private rooms are perfect for hosting your own gaming events and tournaments
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/book-room"
                                className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
                            >
                                Book a Room
                            </Link>
                            <Link
                                href={route('contact')}
                                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}