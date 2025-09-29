<?php

namespace App\Http\Requests;

use App\Models\GamingSession;
use App\Services\SessionBookingService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SessionBookingRequest extends FormRequest
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
            'gaming_session_id' => [
                'required',
                'integer',
                Rule::exists('gaming_sessions', 'id')->where('is_active', true),
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
            'participants' => [
                'required',
                'integer',
                'min:1',
            ],
            'experience_level' => [
                'required',
                'string',
                Rule::in(['none', 'beginner', 'intermediate', 'advanced']),
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
            'gaming_session_id.required' => 'Please select a gaming session.',
            'gaming_session_id.exists' => 'The selected gaming session is not available.',
            'booking_date.required' => 'Please select a booking date.',
            'booking_date.after_or_equal' => 'Booking date must be today or in the future.',
            'start_time.required' => 'Please select a start time.',
            'start_time.date_format' => 'Start time must be in HH:MM format.',
            'participants.required' => 'Please specify the number of participants.',
            'participants.min' => 'At least 1 participant is required.',
            'experience_level.required' => 'Please select your experience level.',
            'experience_level.in' => 'Please select a valid experience level.',
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
                $this->validateParticipantCount($validator);
                $this->validateSessionDuration($validator);
            }
        });
    }

    /**
     * Validate session availability for the requested time slot.
     */
    protected function validateAvailability($validator)
    {
        $session = GamingSession::find($this->gaming_session_id);
        if (!$session) {
            return;
        }

        $sessionBookingService = app(SessionBookingService::class);
        
        if (!$sessionBookingService->isSessionAvailable(
            $session,
            $this->booking_date,
            $this->start_time
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
        $session = GamingSession::find($this->gaming_session_id);
        if (!$session) {
            return;
        }

        $startHour = (int) substr($this->start_time, 0, 2);
        $endTime = date('H:i', strtotime($this->start_time . ' +' . $session->duration . ' minutes'));
        $endHour = (int) substr($endTime, 0, 2);

        // Business hours: 9 AM to 11 PM
        if ($startHour < 9 || $endHour > 23) {
            $validator->errors()->add(
                'booking',
                'Sessions must start and end between 9:00 AM and 11:00 PM.'
            );
        }
    }

    /**
     * Validate participant count doesn't exceed session maximum.
     */
    protected function validateParticipantCount($validator)
    {
        $session = GamingSession::find($this->gaming_session_id);
        if (!$session) {
            return;
        }

        if ($this->participants > $session->max_participants) {
            $validator->errors()->add(
                'participants',
                "Maximum {$session->max_participants} participants allowed for this session."
            );
        }
    }

    /**
     * Validate session fits within business hours.
     */
    protected function validateSessionDuration($validator)
    {
        $session = GamingSession::find($this->gaming_session_id);
        if (!$session) {
            return;
        }

        $startTime = strtotime($this->start_time);
        $endTime = $startTime + ($session->duration * 60);
        $businessEnd = strtotime('23:00');

        if ($endTime > $businessEnd) {
            $validator->errors()->add(
                'start_time',
                'Session would end after business hours (11:00 PM). Please select an earlier start time.'
            );
        }
    }
}