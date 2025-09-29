import React, { useState, useEffect } from 'react';
import { Button } from '../UI';
import { route } from '../../utils/route';

interface Room {
    id: number;
    name: string;
    slug: string;
}

interface TimeSlot {
    start_time: string;
    end_time: string;
    available: boolean;
}

interface AvailabilityCalendarProps {
    room: Room;
    selectedDate: string;
    onDateSelect: (date: string) => void;
    onTimeSelect: (startTime: string, endTime: string) => void;
}

export default function AvailabilityCalendar({
    room,
    selectedDate,
    onDateSelect,
    onTimeSelect,
}: AvailabilityCalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [availability, setAvailability] = useState<TimeSlot[]>([]);
    const [loadingAvailability, setLoadingAvailability] = useState(false);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');

    // Generate calendar days
    const generateCalendarDays = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        const days = [];
        const currentDate = new Date(startDate);
        
        for (let i = 0; i < 42; i++) {
            days.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        return days;
    };

    const days = generateCalendarDays();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isToday = (date: Date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const isCurrentMonth = (date: Date) => {
        return date.getMonth() === currentMonth.getMonth();
    };

    const isPastDate = (date: Date) => {
        return date < today;
    };

    const formatDate = (date: Date) => {
        return date.toISOString().split('T')[0];
    };

    const handleDateClick = (date: Date) => {
        if (isPastDate(date)) return;
        
        const dateString = formatDate(date);
        onDateSelect(dateString);
        setSelectedTimeSlot('');
        fetchAvailability(dateString);
    };

    const fetchAvailability = async (date: string) => {
        setLoadingAvailability(true);
        try {
            const response = await fetch(
                route('rooms.availability', { room: room.slug }) + `?date=${date}`
            );
            const data = await response.json();
            setAvailability(data.availability || []);
        } catch (error) {
            console.error('Failed to fetch availability:', error);
            setAvailability([]);
        } finally {
            setLoadingAvailability(false);
        }
    };

    const handleTimeSlotClick = (timeSlot: TimeSlot) => {
        if (!timeSlot.available) return;
        
        const slotKey = `${timeSlot.start_time}-${timeSlot.end_time}`;
        setSelectedTimeSlot(slotKey);
        onTimeSelect(timeSlot.start_time, timeSlot.end_time);
    };

    const formatTime = (time: string) => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
        setCurrentMonth(prev => {
            const newMonth = new Date(prev);
            if (direction === 'prev') {
                newMonth.setMonth(newMonth.getMonth() - 1);
            } else {
                newMonth.setMonth(newMonth.getMonth() + 1);
            }
            return newMonth;
        });
    };

    return (
        <div className="space-y-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth('prev')}
                >
                    ←
                </Button>
                <h3 className="text-lg font-semibold text-gray-900">
                    {currentMonth.toLocaleDateString('en-US', { 
                        month: 'long', 
                        year: 'numeric' 
                    })}
                </h3>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth('next')}
                >
                    →
                </Button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
                {/* Day headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                        {day}
                    </div>
                ))}
                
                {/* Calendar days */}
                {days.map((date, index) => {
                    const dateString = formatDate(date);
                    const isSelected = selectedDate === dateString;
                    const isPast = isPastDate(date);
                    const isCurrent = isCurrentMonth(date);
                    const isTodayDate = isToday(date);
                    
                    return (
                        <button
                            key={index}
                            onClick={() => handleDateClick(date)}
                            disabled={isPast}
                            className={`
                                p-2 text-sm rounded-md transition-colors
                                ${isPast 
                                    ? 'text-gray-300 cursor-not-allowed' 
                                    : 'hover:bg-pink-50 cursor-pointer'
                                }
                                ${!isCurrent ? 'text-gray-400' : 'text-gray-900'}
                                ${isSelected ? 'bg-pink-500 text-white hover:bg-pink-600' : ''}
                                ${isTodayDate && !isSelected ? 'bg-gray-100 font-semibold' : ''}
                            `}
                        >
                            {date.getDate()}
                        </button>
                    );
                })}
            </div>

            {/* Time Slots */}
            {selectedDate && (
                <div className="border-t pt-6">
                    <h4 className="text-md font-medium text-gray-900 mb-4">
                        Available Times for {new Date(selectedDate).toLocaleDateString()}
                    </h4>
                    
                    {loadingAvailability ? (
                        <div className="text-center py-4">
                            <div className="text-gray-500">Loading availability...</div>
                        </div>
                    ) : availability.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {availability.map((timeSlot, index) => {
                                const slotKey = `${timeSlot.start_time}-${timeSlot.end_time}`;
                                const isSelected = selectedTimeSlot === slotKey;
                                
                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleTimeSlotClick(timeSlot)}
                                        disabled={!timeSlot.available}
                                        className={`
                                            p-3 text-sm rounded-md border transition-colors
                                            ${timeSlot.available
                                                ? isSelected
                                                    ? 'bg-pink-500 text-white border-pink-500'
                                                    : 'bg-white text-gray-900 border-gray-300 hover:bg-pink-50 hover:border-pink-300'
                                                : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                            }
                                        `}
                                    >
                                        <div className="font-medium">
                                            {formatTime(timeSlot.start_time)}
                                        </div>
                                        <div className="text-xs opacity-75">
                                            to {formatTime(timeSlot.end_time)}
                                        </div>
                                        {!timeSlot.available && (
                                            <div className="text-xs mt-1">
                                                Unavailable
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-4 text-gray-500">
                            No availability data found for this date.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}