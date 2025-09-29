import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Components/Layout/AdminLayout';
import { Button, Input, Select, Card } from '@/Components/UI';

interface User {
    id: number;
    name: string;
    email: string;
}

interface GamingSession {
    id: number;
    name: string;
    system: string;
}

interface SessionBooking {
    id: number;
    user: User;
    gaming_session: GamingSession;
    booking_date: string;
    start_time: string;
    participants: number;
    experience_level: string;
    status: string;
    special_requests?: string;
    admin_notes?: string;
    created_at: string;
}

interface Props {
    bookings: {
        data: SessionBooking[];
        links: any[];
        meta: any;
    };
    gamingSessions: GamingSession[];
    statusOptions: Record<string, string>;
    experienceLevels: Record<string, string>;
    filters: {
        status?: string;
        gaming_session_id?: string;
        experience_level?: string;
        date_from?: string;
        date_to?: string;
        search?: string;
    };
}

export default function Index({ bookings, gamingSessions, statusOptions, experienceLevels, filters }: Props) {
    const [searchForm, setSearchForm] = useState({
        status: filters.status || '',
        gaming_session_id: filters.gaming_session_id || '',
        experience_level: filters.experience_level || '',
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
        search: filters.search || '',
    });

    const handleFilter = () => {
        router.get(route('admin.session-bookings.index'), searchForm, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setSearchForm({
            status: '',
            gaming_session_id: '',
            experience_level: '',
            date_from: '',
            date_to: '',
            search: '',
        });
        router.get(route('admin.session-bookings.index'));
    };

    const getStatusBadgeClass = (status: string) => {
        const classes = {
            pending: 'bg-yellow-100 text-yellow-800',
            confirmed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
            completed: 'bg-blue-100 text-blue-800',
        };
        return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800';
    };

    const getExperienceBadgeClass = (level: string) => {
        const classes = {
            beginner: 'bg-green-100 text-green-800',
            intermediate: 'bg-yellow-100 text-yellow-800',
            advanced: 'bg-red-100 text-red-800',
        };
        return classes[level as keyof typeof classes] || 'bg-gray-100 text-gray-800';
    };

    return (
        <AdminLayout>
            <Head title="Session Bookings" />

            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Session Bookings</h1>
                </div>

                {/* Filters */}
                <Card className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                        <Input
                            type="text"
                            placeholder="Search by customer name or email..."
                            value={searchForm.search}
                            onChange={(e) => setSearchForm({ ...searchForm, search: e.target.value })}
                        />
                        
                        <Select
                            value={searchForm.status}
                            onChange={(e) => setSearchForm({ ...searchForm, status: e.target.value })}
                        >
                            <option value="">All Statuses</option>
                            {Object.entries(statusOptions).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </Select>

                        <Select
                            value={searchForm.gaming_session_id}
                            onChange={(e) => setSearchForm({ ...searchForm, gaming_session_id: e.target.value })}
                        >
                            <option value="">All Sessions</option>
                            {gamingSessions.map((session) => (
                                <option key={session.id} value={session.id}>
                                    {session.name} ({session.system})
                                </option>
                            ))}
                        </Select>

                        <Select
                            value={searchForm.experience_level}
                            onChange={(e) => setSearchForm({ ...searchForm, experience_level: e.target.value })}
                        >
                            <option value="">All Experience Levels</option>
                            {Object.entries(experienceLevels).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </Select>

                        <Input
                            type="date"
                            placeholder="From Date"
                            value={searchForm.date_from}
                            onChange={(e) => setSearchForm({ ...searchForm, date_from: e.target.value })}
                        />

                        <Input
                            type="date"
                            placeholder="To Date"
                            value={searchForm.date_to}
                            onChange={(e) => setSearchForm({ ...searchForm, date_to: e.target.value })}
                        />
                    </div>

                    <div className="flex gap-2 mt-4">
                        <Button onClick={handleFilter} variant="primary">
                            Apply Filters
                        </Button>
                        <Button onClick={clearFilters} variant="secondary">
                            Clear Filters
                        </Button>
                    </div>
                </Card>

                {/* Bookings Table */}
                <Card>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Session
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date & Time
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Participants
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Experience
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Booked At
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {bookings.data.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {booking.user.name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {booking.user.email}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {booking.gaming_session.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {booking.gaming_session.system}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {new Date(booking.booking_date).toLocaleDateString()}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {booking.start_time}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {booking.participants}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getExperienceBadgeClass(booking.experience_level)}`}>
                                                {experienceLevels[booking.experience_level]}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(booking.status)}`}>
                                                {statusOptions[booking.status]}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(booking.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link
                                                href={route('admin.session-bookings.show', booking.id)}
                                                className="text-primary-600 hover:text-primary-900"
                                            >
                                                View Details
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {bookings.links && (
                        <div className="px-6 py-3 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-700">
                                    Showing {bookings.meta.from} to {bookings.meta.to} of {bookings.meta.total} results
                                </div>
                                <div className="flex space-x-1">
                                    {bookings.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`px-3 py-2 text-sm rounded-md ${
                                                link.active
                                                    ? 'bg-primary-600 text-white'
                                                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                            } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </AdminLayout>
    );
}