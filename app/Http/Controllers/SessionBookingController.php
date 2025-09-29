<?php

namespace App\Http\Controllers;

use App\Http\Requests\SessionBookingRequest;
use App\Models\GamingSession;
use App\Models\SessionBooking;
use App\Services\BookingService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SessionBookingController extends Controller
{
    public function __construct(
        private BookingService $bookingService
    ) {
        $this->middleware('auth')->except(['index', 'show']);
    }

    /**
     * Display the session booking page.
     */
    public function index(): Response
    {
        $sessions = GamingSession::active()->get();
        
        return Inertia::render('BookSession', [
            'sessions' => $sessions,
        ]);
    }

    /**
     * Show session details and booking form.
     */
    public function show(GamingSession $session): Response
    {
        return Inertia::render('BookSession', [
            'sessions' => GamingSession::active()->get(),
            'selectedSession' => $session,
        ]);
    }

    /**
     * Get availability for a specific session and date.
     */
    public function availability(GamingSession $session, Request $request)
    {
        $request->validate([
            'date' => 'required|date|after_or_equal:today',
        ]);

        $availability = $this->bookingService->getSessionAvailability(
            $session,
            $request->date
        );

        return response()->json([
            'availability' => $availability,
        ]);
    }

    /**
     * Store a new session booking.
     */
    public function store(SessionBookingRequest $request)
    {
        try {
            $booking = $this->bookingService->createSessionBooking(
                $request->validated(),
                $request->user()
            );

            return redirect()->route('session-bookings.confirmation', $booking)
                ->with('success', 'Session booking confirmed! A confirmation email has been sent.');
        } catch (\Exception $e) {
            return back()->withErrors([
                'booking' => $e->getMessage()
            ])->withInput();
        }
    }

    /**
     * Show booking confirmation.
     */
    public function confirmation(SessionBooking $booking): Response
    {
        // Ensure user can only see their own bookings
        if ($booking->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('BookingConfirmation', [
            'booking' => $booking->load(['gamingSession', 'user']),
            'type' => 'session',
        ]);
    }
}