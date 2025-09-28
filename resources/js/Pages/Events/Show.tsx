import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Components/Layout/AppLayout';
import { Event } from '@/types';

interface Props {
    event: Event;
}

export default function EventShow({ event }: Props) {
    const eventDate = new Date(event.event_date);
    const isUpcoming = eventDate >= new Date();

    return (
        <AppLayout>
            <Head title={`${event.title} - Events - Adventurers' Hall`} />
            
            <div className="min-h-screen bg-white">
                {/* Event Header */}
                <section className="relative bg-gradient-to-r from-black via-gray-900 to-black py-20">
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <nav className="mb-8">
                            <Link
                                href={route('events.index')}
                                className="inline-flex items-center text-pink-400 hover:text-pink-300 transition-colors"
                            >
                                <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to Events
                            </Link>
                        </nav>
                        
                        <div className="text-center">
                            <div className="flex items-center justify-center text-sm text-gray-300 mb-4">
                                <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <time dateTime={event.event_date}>
                                    {eventDate.toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </time>
                                {event.start_time && (
                                    <>
                                        <span className="mx-2">•</span>
                                        <span>{event.start_time}</span>
                                        {event.end_time && (
                                            <>
                                                <span className="mx-1">-</span>
                                                <span>{event.end_time}</span>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                {event.title}
                            </h1>
                            {isUpcoming && (
                                <div className="inline-flex items-center bg-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
                                    <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Upcoming Event
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Featured Image */}
                {event.featured_image && (
                    <section className="py-8">
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                                <img
                                    src={event.featured_image}
                                    alt={event.title}
                                    className={`w-full h-96 object-cover ${!isUpcoming ? 'grayscale' : ''}`}
                                />
                            </div>
                        </div>
                    </section>
                )}

                {/* Event Details */}
                <section className="py-12">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Event Information */}
                            <div className="md:col-span-2">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Details</h2>
                                <div 
                                    className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-pink-500 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900"
                                    dangerouslySetInnerHTML={{ __html: event.description }}
                                />
                            </div>

                            {/* Event Info Sidebar */}
                            <div className="space-y-6">
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Information</h3>
                                    
                                    <div className="space-y-4">
                                        <div className="flex items-start">
                                            <svg className="mr-3 w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Date</p>
                                                <p className="text-sm text-gray-600">
                                                    {eventDate.toLocaleDateString('en-US', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>

                                        {event.start_time && (
                                            <div className="flex items-start">
                                                <svg className="mr-3 w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Time</p>
                                                    <p className="text-sm text-gray-600">
                                                        {event.start_time}
                                                        {event.end_time && ` - ${event.end_time}`}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {event.location && (
                                            <div className="flex items-start">
                                                <svg className="mr-3 w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Location</p>
                                                    <p className="text-sm text-gray-600">{event.location}</p>
                                                </div>
                                            </div>
                                        )}

                                        {event.max_participants && (
                                            <div className="flex items-start">
                                                <svg className="mr-3 w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Max Participants</p>
                                                    <p className="text-sm text-gray-600">{event.max_participants} people</p>
                                                </div>
                                            </div>
                                        )}

                                        {event.registration_required && (
                                            <div className="flex items-start">
                                                <svg className="mr-3 w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Registration</p>
                                                    <p className="text-sm text-gray-600">Required</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Call to Action */}
                                {isUpcoming && (
                                    <div className="bg-pink-50 border border-pink-200 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-pink-900 mb-2">Interested in Attending?</h3>
                                        <p className="text-sm text-pink-700 mb-4">
                                            {event.registration_required 
                                                ? "Registration is required for this event. Contact us to secure your spot!"
                                                : "Join us for this exciting event! No registration required."
                                            }
                                        </p>
                                        <Link
                                            href={route('contact')}
                                            className="inline-flex items-center bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            Contact Us
                                            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Related Events or Call to Action */}
                <section className="py-12 bg-gray-50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                {isUpcoming ? "Don't Miss Out!" : "Missed This Event?"}
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {isUpcoming 
                                    ? "Stay updated with all our upcoming events and gaming opportunities"
                                    : "Check out our other events and stay tuned for future gaming opportunities"
                                }
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href={route('events.index')}
                                    className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                >
                                    View All Events
                                </Link>
                                <Link
                                    href={route('news.index')}
                                    className="bg-transparent border-2 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                >
                                    Latest News
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}