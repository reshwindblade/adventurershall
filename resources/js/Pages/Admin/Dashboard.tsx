import React from 'react';
import AdminLayout from '@/Components/Layout/AdminLayout';
import { Card } from '@/Components/UI';
import { Head } from '@inertiajs/react';

interface DashboardStats {
    total_users: number;
    total_room_bookings: number;
    total_session_bookings: number;
    pending_contact_inquiries: number;
    recent_room_bookings: Array<{
        id: number;
        booking_date: string;
        start_time: string;
        end_time: string;
        user: {
            name: string;
            email: string;
        };
        room: {
            name: string;
        };
    }>;
    recent_session_bookings: Array<{
        id: number;
        booking_date: string;
        start_time: string;
        user: {
            name: string;
            email: string;
        };
        gaming_session: {
            name: string;
        };
    }>;
    recent_contact_inquiries: Array<{
        id: number;
        name: string;
        email: string;
        message: string;
        created_at: string;
    }>;
    published_news_articles: number;
    published_events: number;
}

interface DashboardProps {
    stats: DashboardStats;
}

export default function Dashboard({ stats }: DashboardProps) {
    return (
        <AdminLayout title="Dashboard">
            <Head title="Admin Dashboard" />
            
            <div className="space-y-6">
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Total Users</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.total_users}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Room Bookings</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.total_room_bookings}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Session Bookings</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.total_session_bookings}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Pending Inquiries</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.pending_contact_inquiries}</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Room Bookings */}
                    <Card className="p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Room Bookings</h3>
                        <div className="space-y-3">
                            {stats.recent_room_bookings.length > 0 ? (
                                stats.recent_room_bookings.map((booking) => (
                                    <div key={booking.id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{booking.room.name}</p>
                                            <p className="text-xs text-gray-500">
                                                {booking.user.name} - {booking.booking_date} at {booking.start_time}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">No recent room bookings</p>
                            )}
                        </div>
                    </Card>

                    {/* Recent Session Bookings */}
                    <Card className="p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Session Bookings</h3>
                        <div className="space-y-3">
                            {stats.recent_session_bookings.length > 0 ? (
                                stats.recent_session_bookings.map((booking) => (
                                    <div key={booking.id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{booking.gaming_session.name}</p>
                                            <p className="text-xs text-gray-500">
                                                {booking.user.name} - {booking.booking_date} at {booking.start_time}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">No recent session bookings</p>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Recent Contact Inquiries */}
                <Card className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Contact Inquiries</h3>
                    <div className="space-y-3">
                        {stats.recent_contact_inquiries.length > 0 ? (
                            stats.recent_contact_inquiries.map((inquiry) => (
                                <div key={inquiry.id} className="py-3 border-b border-gray-200 last:border-b-0">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">{inquiry.name}</p>
                                            <p className="text-xs text-gray-500 mb-1">{inquiry.email}</p>
                                            <p className="text-sm text-gray-700">{inquiry.message.substring(0, 100)}...</p>
                                        </div>
                                        <span className="text-xs text-gray-500">
                                            {new Date(inquiry.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500">No recent contact inquiries</p>
                        )}
                    </div>
                </Card>

                {/* Content Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Content Statistics</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Published News Articles</span>
                                <span className="text-sm font-medium text-gray-900">{stats.published_news_articles}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Published Events</span>
                                <span className="text-sm font-medium text-gray-900">{stats.published_events}</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}