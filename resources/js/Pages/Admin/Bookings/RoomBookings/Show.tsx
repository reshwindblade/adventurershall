import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Components/Layout/AdminLayout';
import { Button, Select, Textarea, Card } from '@/Components/UI';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Room {
    id: number;
    name: string;
    description: string;
    capacity: number;
    hourly_rate: string;
}

interface RoomBooking {
    id: number;
    user: User;
    room: Room;
    booking_date: string;
    start_time: string;
    end_time: string;
    total_cost: string;
    status: string;
    special_requests?: string;
    admin_notes?: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    booking: RoomBooking;
}

export default function Show({ booking }: Props) {
    const [form, setForm] = useState({
        status: booking.status,
        admin_notes: booking.admin_notes || '',
    });
    const [isUpdating, setIsUpdating] = useState(false);

    const statusOptions = {
        pending: 'Pending',
        confirmed: 'Confirmed',
        cancelled: 'Cancelled',
        completed: 'Completed',
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdating(true);

        router.put(route('admin.room-bookings.update', booking.id), form, {
            onFinish: () => setIsUpdating(false),
        });
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

    return (
        <AdminLayout>
            <Head title={`Room Booking #${booking.id}`} />

            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Room Booking #{booking.id}
                        </h1>
                        <p className="text-gray-600">
                            Booked on {new Date(booking.created_at).toLocaleDateString()}
                        </p>
                    </div>
                    <Link
                        href={route('admin.room-bookings.index')}
                        className="text-primary-600 hover:text-primary-900"
                    >
                        ← Back to Bookings
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Booking Details */}
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Details</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(booking.status)}`}>
                                    {statusOptions[booking.status as keyof typeof statusOptions]}
                                </span>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Room</label>
                                <p className="text-sm text-gray-900">{booking.room.name}</p>
                                <p className="text-xs text-gray-500">{booking.room.description}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Date</label>
                                    <p className="text-sm text-gray-900">
                                        {new Date(booking.booking_date).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Time</label>
                                    <p className="text-sm text-gray-900">
                                        {booking.start_time} - {booking.end_time}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Total Cost</label>
                                <p className="text-lg font-semibold text-gray-900">${booking.total_cost}</p>
                            </div>

                            {booking.special_requests && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Special Requests</label>
                                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                                        {booking.special_requests}
                                    </p>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Customer Details */}
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Details</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <p className="text-sm text-gray-900">{booking.user.name}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <p className="text-sm text-gray-900">{booking.user.email}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Booking Created</label>
                                <p className="text-sm text-gray-900">
                                    {new Date(booking.created_at).toLocaleString()}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                                <p className="text-sm text-gray-900">
                                    {new Date(booking.updated_at).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Admin Management */}
                <Card className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Admin Management</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Update Status
                                </label>
                                <Select
                                    value={form.status}
                                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                                    required
                                >
                                    {Object.entries(statusOptions).map(([value, label]) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </Select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Admin Notes
                            </label>
                            <Textarea
                                value={form.admin_notes}
                                onChange={(e) => setForm({ ...form, admin_notes: e.target.value })}
                                rows={4}
                                placeholder="Add internal notes about this booking..."
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={isUpdating}
                            >
                                {isUpdating ? 'Updating...' : 'Update Booking'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </AdminLayout>
    );
}