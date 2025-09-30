<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoomBookingRequest;
use App\Models\Room;
use App\Models\RoomBooking;
use App\Services\BookingService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RoomBookingController extends Controller
{
    public function __construct(
        private BookingService $bookingService
    ) {
        $this->middleware('auth')->except(['index', 'show']);
    }

    /**
     * Display the room booking page.
     */
    public function index(): Response
    {
        $rooms = cache()->remember('active_rooms', 3600, function () {
            return Room::active()
                ->select(['id', 'name', 'slug', 'description', 'capacity', 'hourly_rate', 'image_path'])
                ->get();
        });
        
        return Inertia::render('BookRoom', [
            'rooms' => $rooms,
        ]);
    }

    /**
     * Show room details and booking form.
     */
    public function show(Room $room): Response
    {
        $rooms = cache()->remember('active_rooms', 3600, function () {
            return Room::active()
                ->select(['id', 'name', 'slug', 'description', 'capacity', 'hourly_rate', 'image_path'])
                ->get();
        });

        return Inertia::render('BookRoom', [
            'rooms' => $rooms,
            'selectedRoom' => $room,
        ]);
    }

    /**
     * Get availability for a specific room and date.
     */
    public function availability(Room $room, Request $request)
    {
        $request->validate([
            'date' => 'required|date|after_or_equal:today',
        ]);

        $availability = $this->bookingService->getRoomAvailability(
            $room,
            $request->date
        );

        return response()->json([
            'availability' => $availability,
        ]);
    }

    /**
     * Store a new room booking.
     */
    public function store(RoomBookingRequest $request)
    {
        try {
            $booking = $this->bookingService->createRoomBooking(
                $request->validated(),
                $request->user()
            );

            return redirect()->route('bookings.confirmation', $booking)
                ->with('success', 'Room booking confirmed! A confirmation email has been sent.');
        } catch (\Exception $e) {
            return back()->withErrors([
                'booking' => $e->getMessage()
            ])->withInput();
        }
    }

    /**
     * Show booking confirmation.
     */
    public function confirmation(RoomBooking $booking): Response
    {
        // Ensure user can only see their own bookings
        if ($booking->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('BookingConfirmation', [
            'booking' => $booking->load(['room', 'user']),
            'type' => 'room',
        ]);
    }
}