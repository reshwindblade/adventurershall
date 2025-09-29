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

interface EventsIndexProps {
    events: Event[];
}

export default function Index({ events }: EventsIndexProps) {
    return (
        <AdminLayout title="Events">
            <Head title="Manage Events" />
            
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">Events</h2>
                    <Link href="/admin/events/create">
                        <Button>Create New Event</Button>
                    </Link>
                </div>

                <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Event
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date & Time
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Location
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {events.map((event) => (
                                    <tr key={event.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                {event.featured_image && (
                                                    <div className="flex-shrink-0 h-10 w-10 mr-4">
                                                        <img
                                                            className="h-10 w-10 rounded object-cover"
                                                            src={`/storage/${event.featured_image}`}
                                                            alt=""
                                                        />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {event.title}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {event.description && event.description.substring(0, 60)}...
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {new Date(event.event_date).toLocaleDateString()}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {event.start_time}
                                                {event.end_time && ` - ${event.end_time}`}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {event.location || 'TBD'}
                                            </div>
                                            {event.max_participants && (
                                                <div className="text-sm text-gray-500">
                                                    Max: {event.max_participants} people
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col space-y-1">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    event.is_published 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {event.is_published ? 'Published' : 'Draft'}
                                                </span>
                                                {event.registration_required && (
                                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                        Registration Required
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            <Link
                                                href={`/admin/events/${event.id}`}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                View
                                            </Link>
                                            <Link
                                                href={`/admin/events/${event.id}/edit`}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                Edit
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {events.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No events found.</p>
                                <Link href="/admin/events/create" className="mt-4 inline-block">
                                    <Button>Create your first event</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </AdminLayout>
    );
}