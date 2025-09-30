<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\RoomBooking;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoomBookingController extends Controller
{
    /**
     * Display a listing of room bookings.
     */
    public function index(Request $request)
    {
        $query = RoomBooking::with(['user:id,name,email', 'room:id,name,slug'])
            ->select(['id', 'user_id', 'room_id', 'booking_date', 'start_time', 'end_time', 'status', 'total_cost', 'created_at']);

        // Apply filters
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('room_id')) {
            $query->where('room_id', $request->room_id);
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

        // Get filter options with caching
        $rooms = cache()->remember('rooms_filter_options', 3600, function () {
            return \App\Models\Room::select('id', 'name')->active()->get();
        });
        
        $statusOptions = [
            'pending' => 'Pending',
            'confirmed' => 'Confirmed',
            'cancelled' => 'Cancelled',
            'completed' => 'Completed'
        ];

        return Inertia::render('Admin/Bookings/RoomBookings/Index', [
            'bookings' => $bookings,
            'rooms' => $rooms,
            'statusOptions' => $statusOptions,
            'filters' => $request->only(['status', 'room_id', 'date_from', 'date_to', 'search'])
        ]);
    }

    /**
     * Display the specified room booking.
     */
    public function show(RoomBooking $roomBooking)
    {
        $roomBooking->load(['user', 'room']);

        return Inertia::render('Admin/Bookings/RoomBookings/Show', [
            'booking' => $roomBooking
        ]);
    }

    /**
     * Update the specified room booking status.
     */
    public function update(Request $request, RoomBooking $roomBooking)
    {
        $request->validate([
            'status' => 'required|in:pending,confirmed,cancelled,completed',
            'admin_notes' => 'nullable|string|max:1000'
        ]);

        $roomBooking->update([
            'status' => $request->status,
            'admin_notes' => $request->admin_notes
        ]);

        return redirect()->back()->with('success', 'Booking updated successfully.');
    }
}