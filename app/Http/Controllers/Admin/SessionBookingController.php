<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SessionBooking;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SessionBookingController extends Controller
{
    /**
     * Display a listing of session bookings.
     */
    public function index(Request $request)
    {
        $query = SessionBooking::with(['user', 'gamingSession']);

        // Apply filters
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('gaming_session_id')) {
            $query->where('gaming_session_id', $request->gaming_session_id);
        }

        if ($request->filled('experience_level')) {
            $query->where('experience_level', $request->experience_level);
        }

        if ($request->filled('date_from')) {
            $query->where('booking_date', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->where('booking_date', '<=', $request->date_to);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $bookings = $query->orderBy('booking_date', 'desc')
                          ->orderBy('start_time', 'desc')
                          ->paginate(15)
                          ->withQueryString();

        // Get filter options
        $gamingSessions = \App\Models\GamingSession::select('id', 'name', 'system')->get();
        $statusOptions = [
            'pending' => 'Pending',
            'confirmed' => 'Confirmed',
            'cancelled' => 'Cancelled',
            'completed' => 'Completed'
        ];
        $experienceLevels = [
            'beginner' => 'Beginner',
            'intermediate' => 'Intermediate',
            'advanced' => 'Advanced'
        ];

        return Inertia::render('Admin/Bookings/SessionBookings/Index', [
            'bookings' => $bookings,
            'gamingSessions' => $gamingSessions,
            'statusOptions' => $statusOptions,
            'experienceLevels' => $experienceLevels,
            'filters' => $request->only(['status', 'gaming_session_id', 'experience_level', 'date_from', 'date_to', 'search'])
        ]);
    }

    /**
     * Display the specified session booking.
     */
    public function show(SessionBooking $sessionBooking)
    {
        $sessionBooking->load(['user', 'gamingSession']);

        return Inertia::render('Admin/Bookings/SessionBookings/Show', [
            'booking' => $sessionBooking
        ]);
    }

    /**
     * Update the specified session booking status.
     */
    public function update(Request $request, SessionBooking $sessionBooking)
    {
        $request->validate([
            'status' => 'required|in:pending,confirmed,cancelled,completed',
            'admin_notes' => 'nullable|string|max:1000'
        ]);

        $sessionBooking->update([
            'status' => $request->status,
            'admin_notes' => $request->admin_notes
        ]);

        return redirect()->back()->with('success', 'Booking updated successfully.');
    }
}