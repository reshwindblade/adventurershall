import React from 'react';
import { Alert, Button } from '../UI';

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

interface BookingConflictAlertProps {
    conflict: BookingConflict;
    onSelectSuggested?: (startTime: string, endTime: string) => void;
    onDismiss?: () => void;
    className?: string;
}

export default function BookingConflictAlert({
    conflict,
    onSelectSuggested,
    onDismiss,
    className = '',
}: BookingConflictAlertProps) {
    const formatTime = (time: string) => {
        return new Date(`2000-01-01 ${time}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <Alert type="error" className={className} onClose={onDismiss}>
            <div className="space-y-4">
                <div>
                    <h4 className="font-semibold text-red-100 mb-2">
                        Time Slot Not Available
                    </h4>
                    <p className="text-red-200">
                        The requested time slot from {formatTime(conflict.startTime)} to {formatTime(conflict.endTime)} 
                        on {formatDate(conflict.date)} is not available.
                    </p>
                </div>

                {conflict.conflictingBookings && conflict.conflictingBookings.length > 0 && (
                    <div>
                        <h5 className="font-medium text-red-100 mb-2">Conflicting Bookings:</h5>
                        <ul className="space-y-1 text-sm text-red-200">
                            {conflict.conflictingBookings.map((booking, index) => (
                                <li key={index} className="flex items-center">
                                    <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                                    {booking.user_name && ` (${booking.user_name})`}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {conflict.suggestedTimes && conflict.suggestedTimes.length > 0 && (
                    <div>
                        <h5 className="font-medium text-red-100 mb-3">Available Alternative Times:</h5>
                        <div className="grid gap-2">
                            {conflict.suggestedTimes.map((suggestion, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-red-800 bg-opacity-50 rounded border border-red-600"
                                >
                                    <span className="text-red-100">
                                        {formatTime(suggestion.start_time)} - {formatTime(suggestion.end_time)}
                                    </span>
                                    {onSelectSuggested && (
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => onSelectSuggested(suggestion.start_time, suggestion.end_time)}
                                            className="text-red-100 border-red-400 hover:bg-red-700"
                                        >
                                            Select
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onDismiss}
                        className="text-red-100 border-red-400 hover:bg-red-700"
                    >
                        Choose Different Time
                    </Button>
                </div>
            </div>
        </Alert>
    );
}