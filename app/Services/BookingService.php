<?php

namespace App\Services;

use App\Models\Room;
use App\Models\RoomBooking;
use App\Models\SessionBooking;
use App\Models\GamingSession;
use App\Models\User;
use App\Services\EmailService;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class BookingService
{
    public function __construct(
        private EmailService $emailService
    ) {}
    /**
     * Check if a room is available for the given time slot.
     */
    public function isRoomAvailable(
        Room $room,
        string $date,
        string $startTime,
        string $endTime,
        ?int $excludeBookingId = null
    ): bool {
        $query = RoomBooking::where('room_id', $room->id)
            ->where('booking_date', $date)
            ->where('status', '!=', 'cancelled')
            ->where(function ($q) use ($startTime, $endTime) {
                // Check for overlapping time slots
                $q->where(function ($subQ) use ($startTime, $endTime) {
                    // New booking starts during existing booking
                    $subQ->where('start_time', '<=', $startTime)
                         ->where('end_time', '>', $startTime);
                })->orWhere(function ($subQ) use ($startTime, $endTime) {
                    // New booking ends during existing booking
                    $subQ->where('start_time', '<', $endTime)
                         ->where('end_time', '>=', $endTime);
                })->orWhere(function ($subQ) use ($startTime, $endTime) {
                    // New booking encompasses existing booking
                    $subQ->where('start_time', '>=', $startTime)
                         ->where('end_time', '<=', $endTime);
                });
            });

        if ($excludeBookingId) {
            $query->where('id', '!=', $excludeBookingId);
        }

        return $query->count() === 0;
    }

    /**
     * Get available time slots for a room on a specific date.
     */
    public function getRoomAvailability(Room $room, string $date): array
    {
        $bookings = RoomBooking::where('room_id', $room->id)
            ->where('booking_date', $date)
            ->where('status', '!=', 'cancelled')
            ->orderBy('start_time')
            ->get(['start_time', 'end_time']);

        $businessStart = '09:00';
        $businessEnd = '23:00';
        $availableSlots = [];

        // Generate all possible hourly slots
        $currentTime = Carbon::createFromFormat('H:i', $businessStart);
        $endTime = Carbon::createFromFormat('H:i', $businessEnd);

        while ($currentTime->lt($endTime)) {
            $slotStart = $currentTime->format('H:i');
            $slotEnd = $currentTime->copy()->addHour()->format('H:i');

            // Check if this slot conflicts with any booking
            $isAvailable = true;
            foreach ($bookings as $booking) {
                $bookingStart = Carbon::createFromFormat('H:i', $booking->start_time->format('H:i'));
                $bookingEnd = Carbon::createFromFormat('H:i', $booking->end_time->format('H:i'));
                $slotStartCarbon = Carbon::createFromFormat('H:i', $slotStart);
                $slotEndCarbon = Carbon::createFromFormat('H:i', $slotEnd);

                // Check for overlap
                if ($slotStartCarbon->lt($bookingEnd) && $slotEndCarbon->gt($bookingStart)) {
                    $isAvailable = false;
                    break;
                }
            }

            $availableSlots[] = [
                'start_time' => $slotStart,
                'end_time' => $slotEnd,
                'available' => $isAvailable,
            ];

            $currentTime->addHour();
        }

        return $availableSlots;
    }

    /**
     * Create a new room booking.
     */
    public function createRoomBooking(array $data, User $user): RoomBooking
    {
        return DB::transaction(function () use ($data, $user) {
            $room = Room::findOrFail($data['room_id']);

            // Double-check availability
            if (!$this->isRoomAvailable(
                $room,
                $data['booking_date'],
                $data['start_time'],
                $data['end_time']
            )) {
                throw new \Exception('The selected time slot is no longer available.');
            }

            // Calculate total cost
            $totalCost = $this->calculateBookingCost(
                $room,
                $data['start_time'],
                $data['end_time']
            );

            // Create the booking
            $booking = RoomBooking::create([
                'user_id' => $user->id,
                'room_id' => $room->id,
                'booking_date' => $data['booking_date'],
                'start_time' => $data['start_time'],
                'end_time' => $data['end_time'],
                'total_cost' => $totalCost,
                'status' => 'confirmed',
                'special_requests' => $data['special_requests'] ?? null,
            ]);

            // Send booking confirmation email
            $this->emailService->sendRoomBookingConfirmation($booking);

            return $booking;
        });
    }

    /**
     * Calculate the total cost for a booking.
     */
    public function calculateBookingCost(Room $room, string $startTime, string $endTime): float
    {
        $start = Carbon::createFromFormat('H:i', $startTime);
        $end = Carbon::createFromFormat('H:i', $endTime);
        
        $hours = $end->diffInHours($start);
        
        return $hours * $room->hourly_rate;
    }

    /**
     * Get upcoming bookings for a user.
     */
    public function getUserUpcomingBookings(User $user): \Illuminate\Database\Eloquent\Collection
    {
        return RoomBooking::where('user_id', $user->id)
            ->where('booking_date', '>=', now()->toDateString())
            ->where('status', '!=', 'cancelled')
            ->with('room')
            ->orderBy('booking_date')
            ->orderBy('start_time')
            ->get();
    }

    /**
     * Check if a session is available for the given time slot.
     */
    public function isSessionAvailable(
        GamingSession $session,
        string $date,
        string $startTime,
        int $participants,
        ?int $excludeBookingId = null
    ): bool {
        // Get all bookings for this session and date, then filter by time in PHP
        // This avoids potential SQLite time format issues
        $allBookings = SessionBooking::where('gaming_session_id', $session->id)
            ->where('booking_date', $date)
            ->where('status', '!=', 'cancelled')
            ->get();
        
        // Filter by start time (handle both H:i and H:i:s formats)
        $matchingBookings = $allBookings->filter(function ($booking) use ($startTime) {
            $bookingTime = $booking->start_time instanceof \Carbon\Carbon 
                ? $booking->start_time->format('H:i')
                : (string) $booking->start_time;
            
            // Remove seconds if present for comparison
            $bookingTime = substr($bookingTime, 0, 5);
            $compareTime = substr($startTime, 0, 5);
            
            return $bookingTime === $compareTime;
        });

        if ($excludeBookingId) {
            $query->where('id', '!=', $excludeBookingId);
        }

        $existingParticipants = $matchingBookings->sum('participants');
        $totalParticipants = $existingParticipants + $participants;
        


        return $totalParticipants <= $session->max_participants;
    }

    /**
     * Create a new session booking.
     */
    public function createSessionBooking(array $data, User $user): SessionBooking
    {
        return DB::transaction(function () use ($data, $user) {
            $session = GamingSession::findOrFail($data['gaming_session_id']);

            // Check availability
            if (!$this->isSessionAvailable(
                $session,
                $data['booking_date'],
                $data['start_time'],
                $data['participants']
            )) {
                throw new \Exception('The selected session time is no longer available for the requested number of participants.');
            }

            // Create the booking
            $booking = SessionBooking::create([
                'user_id' => $user->id,
                'gaming_session_id' => $session->id,
                'booking_date' => $data['booking_date'],
                'start_time' => $data['start_time'],
                'participants' => $data['participants'],
                'experience_level' => $data['experience_level'],
                'special_requests' => $data['special_requests'] ?? null,
                'status' => 'confirmed',
            ]);

            // Send booking confirmation email
            $this->emailService->sendSessionBookingConfirmation($booking);

            return $booking;
        });
    }

    /**
     * Get available session times for a specific date.
     */
    public function getSessionAvailability(GamingSession $session, string $date): array
    {
        $existingBookings = SessionBooking::where('gaming_session_id', $session->id)
            ->where('booking_date', $date)
            ->where('status', '!=', 'cancelled')
            ->get();

        $businessStart = '10:00';
        $businessEnd = '22:00';
        $availableSlots = [];

        // Generate time slots based on session duration
        $currentTime = Carbon::createFromFormat('H:i', $businessStart);
        $endTime = Carbon::createFromFormat('H:i', $businessEnd);
        $sessionDuration = $session->duration; // in minutes

        while ($currentTime->copy()->addMinutes($sessionDuration)->lte($endTime)) {
            $slotStart = $currentTime->format('H:i');
            
            // Calculate current participants for this time slot
            $currentParticipants = $existingBookings
                ->where('start_time', $slotStart)
                ->sum('participants');

            $availableSlots[] = [
                'start_time' => $slotStart,
                'available_spots' => $session->max_participants - $currentParticipants,
                'is_available' => $currentParticipants < $session->max_participants,
            ];

            // Move to next possible start time (every hour for simplicity)
            $currentTime->addHour();
        }

        return $availableSlots;
    }

    /**
     * Get upcoming session bookings for a user.
     */
    public function getUserUpcomingSessionBookings(User $user): \Illuminate\Database\Eloquent\Collection
    {
        return SessionBooking::where('user_id', $user->id)
            ->where('booking_date', '>=', now()->toDateString())
            ->where('status', '!=', 'cancelled')
            ->with('gamingSession')
            ->orderBy('booking_date')
            ->orderBy('start_time')
            ->get();
    }

    /**
     * Cancel a room booking.
     */
    public function cancelRoomBooking(RoomBooking $booking): bool
    {
        // Only allow cancellation if booking is at least 24 hours away
        $bookingDateTime = Carbon::parse($booking->booking_date . ' ' . $booking->start_time);
        
        if ($bookingDateTime->diffInHours(now()) < 24) {
            throw new \Exception('Bookings can only be cancelled at least 24 hours in advance.');
        }

        return $booking->update(['status' => 'cancelled']);
    }

    /**
     * Cancel a session booking.
     */
    public function cancelSessionBooking(SessionBooking $booking): bool
    {
        // Only allow cancellation if booking is at least 24 hours away
        $bookingDateTime = Carbon::parse($booking->booking_date . ' ' . $booking->start_time);
        
        if ($bookingDateTime->diffInHours(now()) < 24) {
            throw new \Exception('Session bookings can only be cancelled at least 24 hours in advance.');
        }

        return $booking->update(['status' => 'cancelled']);
    }
}