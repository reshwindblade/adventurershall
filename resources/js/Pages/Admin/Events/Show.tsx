import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Components/Layout/AdminLayout';
import { Button, Card } from '@/Components/UI';

interface Event {
    id: number;
    title: string;
    slug: string;
    description: string;
    event_date: string;
    start_time: string;
    end_time: string;
    location: string;
    max_participants: number;
    registration_required: boolean;
    featured_image: string;
    is_published: boolean;
    created_at: string;
    updated_at: string;
}

interface ShowProps {
    event: Event;
}

export default function Show({ event }: ShowProps) {
    return (
        <AdminLayout title={event.title}>
            <Head title={`Event: ${event.title}`} />
            
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{event.title}</h2>
                        <p className="text-sm text-gray-500">/events/{event.slug}</p>
                    </div>
                    <div className="flex space-x-2">
                        <Link href={`/admin/events/${event.id}/edit`}>
                            <Button>Edit Event</Button>
                        </Link>
                        <Link href="/admin/events">
                            <Button variant="outline">Back to Events</Button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        {event.featured_image && (
                            <Card className="p-6 mb-6">
                                <img
                                    src={`/storage/${event.featured_image}`}
                                    alt={event.title}
                                    className="w-full h-64 object-cover rounded-lg"
                                />
                            </Card>
                        )}

                        <Card className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Description</h3>
                            <div 
                                className="prose max-w-none"
                                dangerouslySetInnerHTML={{ __html: event.description }}
                            />
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Event Details</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Status</label>
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                        event.is_published 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {event.is_published ? 'Published' : 'Draft'}
                                    </span>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Date</label>
                                    <p className="text-sm text-gray-900">
                                        {new Date(event.event_date).toLocaleDateString()}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Time</label>
                                    <p className="text-sm text-gray-900">
                                        {event.start_time}
                                        {event.end_time && ` - ${event.end_time}`}
                                    </p>
                                </div>

                                {event.location && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Location</label>
                                        <p className="text-sm text-gray-900">{event.location}</p>
                                    </div>
                                )}

                                {event.max_participants && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Max Participants</label>
                                        <p className="text-sm text-gray-900">{event.max_participants}</p>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Registration</label>
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                        event.registration_required 
                                            ? 'bg-blue-100 text-blue-800' 
                                            : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {event.registration_required ? 'Required' : 'Not Required'}
                                    </span>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Slug</label>
                                    <p className="text-sm text-gray-900">/events/{event.slug}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Created</label>
                                    <p className="text-sm text-gray-900">
                                        {new Date(event.created_at).toLocaleDateString()}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                                    <p className="text-sm text-gray-900">
                                        {new Date(event.updated_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </Card>

                        {event.is_published && (
                            <Card className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Public View</h3>
                                <Link 
                                    href={`/events/${event.slug}`}
                                    className="text-indigo-600 hover:text-indigo-900 text-sm"
                                    target="_blank"
                                >
                                    View on website →
                                </Link>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}