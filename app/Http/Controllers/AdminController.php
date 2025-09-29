<?php

namespace App\Http\Controllers;

use App\Models\ContactInquiry;
use App\Models\Event;
use App\Models\NewsArticle;
use App\Models\RoomBooking;
use App\Models\SessionBooking;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{


    /**
     * Display the admin dashboard with overview statistics.
     */
    public function dashboard(): Response
    {
        $stats = [
            'total_users' => User::count(),
            'total_room_bookings' => RoomBooking::count(),
            'total_session_bookings' => SessionBooking::count(),
            'pending_contact_inquiries' => ContactInquiry::where('status', 'pending')->count(),
            'recent_room_bookings' => RoomBooking::with(['user', 'room'])
                ->latest()
                ->take(5)
                ->get(),
            'recent_session_bookings' => SessionBooking::with(['user', 'gamingSession'])
                ->latest()
                ->take(5)
                ->get(),
            'recent_contact_inquiries' => ContactInquiry::latest()
                ->take(5)
                ->get(),
            'published_news_articles' => NewsArticle::where('is_published', true)->count(),
            'published_events' => Event::where('is_published', true)->count(),
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats
        ]);
    }
}