<?php

namespace App\Http\Requests;

use App\Models\Room;
use App\Services\BookingService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RoomBookingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'room_id' => [
                'required',
                'integer',
                Rule::exists('rooms', 'id')->where('is_active', true),
            ],
            'booking_date' => [
                'required',
                'date',
                'after_or_equal:today',
            ],
            'start_time' => [
                'required',
                'date_format:H:i',
            ],
            'end_time' => [
                'required',
                'date_format:H:i',
                'after:start_time',
            ],
            'special_requests' => [
                'nullable',
                'string',
                'max:1000',
            ],
        ];
    }

    /**
     * Get custom validation messages.
     */
    public function messages(): array
    {
        return [
            'room_id.required' => 'Please select a room.',
            'room_id.exists' => 'The selected room is not available.',
            'booking_date.required' => 'Please select a booking date.',
            'booking_date.after_or_equal' => 'Booking date must be today or in the future.',
            'start_time.required' => 'Please select a start time.',
            'start_time.date_format' => 'Start time must be in HH:MM format.',
            'end_time.required' => 'Please select an end time.',
            'end_time.date_format' => 'End time must be in HH:MM format.',
            'end_time.after' => 'End time must be after start time.',
            'special_requests.max' => 'Special requests cannot exceed 1000 characters.',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if ($validator->errors()->isEmpty()) {
                $this->validateAvailability($validator);
                $this->validateBusinessHours($validator);
                $this->validateMinimumDuration($validator);
            }
        });
    }

    /**
     * Validate room availability for the requested time slot.
     */
    protected function validateAvailability($validator)
    {
        $room = Room::find($this->room_id);
        if (!$room) {
            return;
        }

        $bookingService = app(BookingService::class);
        
        if (!$bookingService->isRoomAvailable(
            $room,
            $this->booking_date,
            $this->start_time,
            $this->end_time
        )) {
            $validator->errors()->add(
                'booking',
                'The selected time slot is not available. Please choose a different time.'
            );
        }
    }

    /**
     * Validate that booking is within business hours.
     */
    protected function validateBusinessHours($validator)
    {
        $startHour = (int) substr($this->start_time, 0, 2);
        $endHour = (int) substr($this->end_time, 0, 2);

        // Business hours: 9 AM to 11 PM
        if ($startHour < 9 || $endHour > 23) {
            $validator->errors()->add(
                'booking',
                'Bookings must be between 9:00 AM and 11:00 PM.'
            );
        }
    }

    /**
     * Validate minimum booking duration (1 hour).
     */
    protected function validateMinimumDuration($validator)
    {
        $start = strtotime($this->start_time);
        $end = strtotime($this->end_time);
        $duration = ($end - $start) / 3600; // Convert to hours

        if ($duration < 1) {
            $validator->errors()->add(
                'booking',
                'Minimum booking duration is 1 hour.'
            );
        }
    }
}