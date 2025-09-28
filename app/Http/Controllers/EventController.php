<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Inertia\Inertia;

class EventController extends Controller
{
    /**
     * Display a listing of events.
     */
    public function index()
    {
        $upcomingEvents = Event::published()
            ->upcoming()
            ->orderBy('event_date', 'asc')
            ->orderBy('start_time', 'asc')
            ->get();

        $pastEvents = Event::published()
            ->past()
            ->orderBy('event_date', 'desc')
            ->orderBy('start_time', 'desc')
            ->limit(10)
            ->get();

        return Inertia::render('Events/Index', [
            'upcomingEvents' => $upcomingEvents,
            'pastEvents' => $pastEvents,
        ]);
    }

    /**
     * Display the specified event.
     */
    public function show(Event $event)
    {
        if (!$event->is_published) {
            abort(404);
        }

        return Inertia::render('Events/Show', [
            'event' => $event,
        ]);
    }
}