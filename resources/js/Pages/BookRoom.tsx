import React, { useState, useEffect } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Button, Card, Input, Select, Textarea } from '../Components/UI';
import AvailabilityCalendar from '../Components/Booking/AvailabilityCalendar';
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
}

interface BookingFormData {
    room_id: number | '';
    booking_date: string;
    start_time: string;
    end_time: string;
    special_requests: string;
}

export default function BookRoom() {
    const { rooms, selectedRoom, auth } = usePage<PageProps>().props;
    const [currentRoom, setCurrentRoom] = useState<Room | null>(selectedRoom || null);
    const [showBookingForm, setShowBookingForm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm<BookingFormData>({
        room_id: selectedRoom?.id || '',
        booking_date: '',
        start_time: '',
        end_time: '',
        special_requests: '',
    });

    useEffect(() => {
        if (selectedRoom) {
            setCurrentRoom(selectedRoom);
            setData('room_id', selectedRoom.id);
        }
    }, [selectedRoom]);

    const handleRoomSelect = (room: Room) => {
        setCurrentRoom(room);
        setData('room_id', room.id);
        setShowBookingForm(false);
    };

    const handleDateSelect = (date: string) => {
        setData('booking_date', date);
        setShowBookingForm(true);
    };

    const handleTimeSelect = (startTime: string, endTime: string) => {
        setData({
            ...data,
            start_time: startTime,
            end_time: endTime,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!auth.user) {
            window.location.href = route('login');
            return;
        }

        post(route('rooms.store'), {
            onSuccess: () => {
                reset();
                setShowBookingForm(false);
            },
        });
    };

    const calculateCost = () => {
        if (!currentRoom || !data.start_time || !data.end_time) return 0;
        
        const start = new Date(`2000-01-01 ${data.start_time}`);
        const end = new Date(`2000-01-01 ${data.end_time}`);
        const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        
        return hours * currentRoom.hourly_rate;
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
                                        selectedDate={data.booking_date}
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
                                            <div className="mb-4 p-4 bg-yellow-900 border border-yellow-700 rounded-md">
                                                <p className="text-yellow-300">
                                                    You need to be logged in to make a booking.{' '}
                                                    <a 
                                                        href={route('login')} 
                                                        className="text-yellow-100 underline font-medium hover:text-white transition-colors"
                                                    >
                                                        Login here
                                                    </a>
                                                </p>
                                            </div>
                                        )}

                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                                    Room
                                                </label>
                                                <div className="text-white font-medium">
                                                    {currentRoom.name}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                                    Date
                                                </label>
                                                <div className="text-white">
                                                    {new Date(data.booking_date).toLocaleDateString()}
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

                                            {data.start_time && data.end_time && (
                                                <div className="p-4 bg-gray-700 rounded-md border border-gray-600">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-300">Total Cost:</span>
                                                        <span className="text-xl font-semibold text-primary-400">
                                                            ${calculateCost().toFixed(2)}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            <Textarea
                                                label="Special Requests (Optional)"
                                                value={data.special_requests}
                                                onChange={(e) => setData('special_requests', e.target.value)}
                                                placeholder="Any special requests or requirements..."
                                                rows={3}
                                                error={errors.special_requests}
                                            />

                                            {errors.booking && (
                                                <div className="text-red-400 text-sm">
                                                    {errors.booking}
                                                </div>
                                            )}

                                            <Button
                                                type="submit"
                                                disabled={processing || !auth.user}
                                                loading={processing}
                                                className="w-full"
                                            >
                                                {processing ? 'Processing...' : 'Confirm Booking'}
                                            </Button>
                                        </form>
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