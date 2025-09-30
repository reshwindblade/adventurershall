import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { Button, Card, Alert, LoadingSpinner } from '../Components/UI';
import AvailabilityCalendar from '../Components/Booking/AvailabilityCalendar';
import ValidatedForm from '../Components/Forms/ValidatedForm';
import BookingConflictAlert from '../Components/Forms/BookingConflictAlert';
import { commonValidationRules } from '../utils/validation';
import { route } from '../utils/route';

interface Room {
    id: number;
    name: string;
    slug: string;
    description: string;
    capacity: number;
    hourly_rate: number;
    image_path?: string;
    is_active: boolean;
}

interface PageProps {
    rooms: Room[];
    selectedRoom?: Room;
    auth: {
        user?: {
            id: number;
            name: string;
            email: string;
        };
    };
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: any;
}

interface BookingFormData {
    room_id: number | '';
    booking_date: string;
    start_time: string;
    end_time: string;
    special_requests: string;
}

interface BookingConflict {
    date: string;
    startTime: string;
    endTime: string;
    conflictingBookings?: Array<{
        id: number;
        start_time: string;
        end_time: string;
        user_name?: string;
    }>;
    suggestedTimes?: Array<{
        start_time: string;
        end_time: string;
    }>;
}

export default function BookRoom() {
    const { rooms, selectedRoom, auth, flash } = usePage<PageProps>().props;
    const [currentRoom, setCurrentRoom] = useState<Room | null>(selectedRoom || null);
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [bookingConflict, setBookingConflict] = useState<BookingConflict | null>(null);
    const [bookingSuccess, setBookingSuccess] = useState(false);

    const validationRules = {
        room_id: { required: true },
        booking_date: commonValidationRules.bookingDate,
        start_time: commonValidationRules.time,
        end_time: commonValidationRules.time,
        special_requests: { maxLength: 1000 },
    };

    const initialData = {
        room_id: selectedRoom?.id || '',
        booking_date: '',
        start_time: '',
        end_time: '',
        special_requests: '',
    };

    useEffect(() => {
        if (selectedRoom) {
            setCurrentRoom(selectedRoom);
        }
    }, [selectedRoom]);

    useEffect(() => {
        if (flash?.success) {
            setBookingSuccess(true);
            setShowBookingForm(false);
        }
    }, [flash]);

    const handleRoomSelect = (room: Room) => {
        setCurrentRoom(room);
        setShowBookingForm(false);
        setBookingConflict(null);
    };

    const handleDateSelect = (date: string) => {
        setShowBookingForm(true);
        setBookingConflict(null);
    };

    const handleTimeSelect = (startTime: string, endTime: string) => {
        setBookingConflict(null);
    };

    const handleBookingError = (errors: any) => {
        // Check if it's a booking conflict error
        if (errors.booking && errors.booking.includes('not available')) {
            // In a real implementation, you'd get conflict details from the server
            setBookingConflict({
                date: new Date().toISOString().split('T')[0], // Use current date as fallback
                startTime: '09:00',
                endTime: '11:00',
                suggestedTimes: [
                    { start_time: '10:00', end_time: '12:00' },
                    { start_time: '14:00', end_time: '16:00' },
                    { start_time: '18:00', end_time: '20:00' },
                ],
            });
        }
    };

    const handleSuggestedTimeSelect = (startTime: string, endTime: string) => {
        setBookingConflict(null);
        // This would update the form with the suggested time
    };



    return (
        <>
            <Head title="Book a Room" />
            
            <div className="min-h-screen bg-gray-900 py-8">
                <div className="container-responsive">
                    <div className="text-center mb-8 animate-fade-in">
                        <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
                            Book a Room
                        </h1>
                        <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
                            Reserve one of our premium gaming rooms for your next adventure. 
                            Choose from our Rose Garden or Obsidian Sanctuary rooms.
                        </p>
                    </div>

                    {/* Success Message */}
                    {bookingSuccess && (
                        <Alert type="success" className="mb-8" onClose={() => setBookingSuccess(false)}>
                            <div>
                                <h4 className="font-semibold mb-1">Booking Confirmed!</h4>
                                <p>Your room booking has been confirmed. You'll receive a confirmation email shortly.</p>
                            </div>
                        </Alert>
                    )}

                    {/* Booking Conflict Alert */}
                    {bookingConflict && (
                        <BookingConflictAlert
                            conflict={bookingConflict}
                            onSelectSuggested={handleSuggestedTimeSelect}
                            onDismiss={() => setBookingConflict(null)}
                            className="mb-8"
                        />
                    )}

                    {/* Room Selection */}
                    <div className="grid sm:grid-cols-2 gap-6 lg:gap-8 mb-8">
                        {rooms.map((room, index) => (
                            <Card
                                key={room.id}
                                className={`cursor-pointer transition-all duration-200 interactive-hover animate-slide-up ${
                                    currentRoom?.id === room.id
                                        ? 'ring-2 ring-primary-500 bg-gray-700'
                                        : 'hover:shadow-xl'
                                }`}
                                style={{animationDelay: `${index * 0.1}s`}}
                                onClick={() => handleRoomSelect(room)}
                            >
                                <div className="p-6">
                                    <h3 className="text-lg lg:text-xl font-display font-semibold text-white mb-2">
                                        {room.name}
                                    </h3>
                                    <p className="text-gray-300 mb-4 leading-relaxed">
                                        {room.description}
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <div className="text-sm text-gray-400">
                                            Capacity: {room.capacity} people
                                        </div>
                                        <div className="text-lg font-semibold text-primary-400">
                                            ${room.hourly_rate}/hour
                                        </div>
                                    </div>
                                    {currentRoom?.id === room.id && (
                                        <div className="mt-4 flex items-center text-sm text-primary-400 font-medium">
                                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Selected
                                        </div>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Calendar and Booking Form */}
                    {currentRoom && (
                        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
                            {/* Calendar */}
                            <Card className="animate-slide-up">
                                <div className="p-6">
                                    <h3 className="text-lg font-display font-semibold text-white mb-4">
                                        Select Date & Time
                                    </h3>
                                    <AvailabilityCalendar
                                        room={currentRoom}
                                        selectedDate=""
                                        onDateSelect={handleDateSelect}
                                        onTimeSelect={handleTimeSelect}
                                    />
                                </div>
                            </Card>

                            {/* Booking Form */}
                            {showBookingForm && (
                                <Card className="animate-slide-up" style={{animationDelay: '0.2s'}}>
                                    <div className="p-6">
                                        <h3 className="text-lg font-display font-semibold text-white mb-4">
                                            Complete Your Booking
                                        </h3>
                                        
                                        {!auth.user && (
                                            <Alert type="warning" className="mb-4">
                                                You need to be logged in to make a booking.{' '}
                                                <a 
                                                    href={route('login')} 
                                                    className="underline font-medium hover:text-yellow-100 transition-colors"
                                                >
                                                    Login here
                                                </a>
                                            </Alert>
                                        )}

                                        <ValidatedForm
                                            action={route('rooms.store')}
                                            method="post"
                                            validationRules={validationRules}
                                            initialData={{
                                                ...initialData,
                                                room_id: currentRoom?.id || '',
                                            }}
                                            onError={handleBookingError}
                                            onSuccess={() => {
                                                setBookingSuccess(true);
                                                setShowBookingForm(false);
                                            }}
                                        >
                                            {({ data, errors, processing, setData }) => (
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                                            Room
                                                        </label>
                                                        <div className="text-white font-medium">
                                                            {currentRoom?.name}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                                            Date
                                                        </label>
                                                        <div className="text-white">
                                                            {data.booking_date && new Date(data.booking_date).toLocaleDateString()}
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                                                Start Time
                                                            </label>
                                                            <div className="text-white">
                                                                {data.start_time}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                                                End Time
                                                            </label>
                                                            <div className="text-white">
                                                                {data.end_time}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {data.start_time && data.end_time && currentRoom && (
                                                        <div className="p-4 bg-gray-700 rounded-md border border-gray-600">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-gray-300">Total Cost:</span>
                                                                <span className="text-xl font-semibold text-primary-400">
                                                                    ${(() => {
                                                                        const start = new Date(`2000-01-01 ${data.start_time}`);
                                                                        const end = new Date(`2000-01-01 ${data.end_time}`);
                                                                        const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                                                                        return (hours * currentRoom.hourly_rate).toFixed(2);
                                                                    })()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div>
                                                        <label htmlFor="special_requests" className="block text-sm font-medium text-gray-300 mb-2">
                                                            Special Requests (Optional)
                                                        </label>
                                                        <textarea
                                                            id="special_requests"
                                                            rows={3}
                                                            value={data.special_requests}
                                                            onChange={(e) => setData('special_requests', e.target.value)}
                                                            className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none ${
                                                                errors.special_requests ? 'border-red-500' : 'border-gray-600'
                                                            }`}
                                                            placeholder="Any special requests or requirements..."
                                                        />
                                                        {errors.special_requests && (
                                                            <p className="mt-2 text-sm text-red-400 flex items-center">
                                                                <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                {errors.special_requests}
                                                            </p>
                                                        )}
                                                        <p className="mt-1 text-xs text-gray-400">
                                                            {data.special_requests.length}/1000 characters
                                                        </p>
                                                    </div>

                                                    <Button
                                                        type="submit"
                                                        disabled={processing || !auth.user || !data.start_time || !data.end_time}
                                                        loading={processing}
                                                        className="w-full"
                                                        variant="primary"
                                                    >
                                                        {processing ? 'Processing Booking...' : 'Confirm Booking'}
                                                    </Button>
                                                </div>
                                            )}
                                        </ValidatedForm>
                                    </div>
                                </Card>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}