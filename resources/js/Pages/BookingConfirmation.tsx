import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button, Card } from '../Components/UI';
import { route } from '../utils/route';

interface Room {
    id: number;
    name: string;
    description: string;
    hourly_rate: number;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface Booking {
    id: number;
    booking_date: string;
    start_time: string;
    end_time: string;
    total_cost: number;
    status: string;
    special_requests?: string;
    room: Room;
    user: User;
    created_at: string;
}

interface PageProps {
    booking: Booking;
    type: 'room' | 'session';
}

export default function BookingConfirmation() {
    const { booking, type } = usePage<PageProps>().props;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (timeString: string) => {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    const getDuration = () => {
        const start = new Date(`2000-01-01 ${booking.start_time}`);
        const end = new Date(`2000-01-01 ${booking.end_time}`);
        const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        return hours;
    };

    return (
        <>
            <Head title="Booking Confirmation" />
            
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Success Header */}
                    <div className="text-center mb-8">
                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <svg 
                                className="w-8 h-8 text-green-600" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M5 13l4 4L19 7" 
                                />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Booking Confirmed!
                        </h1>
                        <p className="text-lg text-gray-600">
                            Your {type} booking has been successfully confirmed. 
                            A confirmation email has been sent to {booking.user.email}.
                        </p>
                    </div>

                    {/* Booking Details */}
                    <Card className="mb-8">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                Booking Details
                            </h2>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">
                                            Booking ID
                                        </label>
                                        <div className="text-gray-900 font-mono">
                                            #{booking.id.toString().padStart(6, '0')}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">
                                            {type === 'room' ? 'Room' : 'Session'}
                                        </label>
                                        <div className="text-gray-900 font-medium">
                                            {booking.room.name}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">
                                            Date
                                        </label>
                                        <div className="text-gray-900">
                                            {formatDate(booking.booking_date)}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">
                                            Time
                                        </label>
                                        <div className="text-gray-900">
                                            {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">
                                            Duration
                                        </label>
                                        <div className="text-gray-900">
                                            {getDuration()} {getDuration() === 1 ? 'hour' : 'hours'}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">
                                            Total Cost
                                        </label>
                                        <div className="text-2xl font-bold text-pink-600">
                                            ${booking.total_cost}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">
                                            Status
                                        </label>
                                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">
                                            Booked On
                                        </label>
                                        <div className="text-gray-900">
                                            {new Date(booking.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {booking.special_requests && (
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <label className="block text-sm font-medium text-gray-500 mb-2">
                                        Special Requests
                                    </label>
                                    <div className="text-gray-900 bg-gray-50 p-3 rounded-md">
                                        {booking.special_requests}
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Important Information */}
                    <Card className="mb-8">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Important Information
                            </h3>
                            <div className="space-y-3 text-sm text-gray-600">
                                <div className="flex items-start">
                                    <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                    <div>
                                        Please arrive 10 minutes before your scheduled time to allow for setup.
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                    <div>
                                        Cancellations must be made at least 24 hours in advance.
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                    <div>
                                        If you have any questions, please contact us at info@adventurershall.com.
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                    <div>
                                        Payment will be collected upon arrival at the venue.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href={route('home')}>
                            <Button variant="outline" className="w-full sm:w-auto">
                                Return to Home
                            </Button>
                        </Link>
                        <Link href={route('rooms.index')}>
                            <Button className="w-full sm:w-auto">
                                Book Another Room
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}