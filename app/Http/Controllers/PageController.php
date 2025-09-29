<?php

namespace App\Http\Controllers;

use App\Models\Page;
use Inertia\Inertia;

class PageController extends Controller
{
    /**
     * Display the home page.
     */
    public function home()
    {
        $homePage = Page::where('slug', 'home')->published()->first();
        
        // Get recent news articles for the home page
        $recentNews = \App\Models\NewsArticle::published()
            ->latest()
            ->limit(3)
            ->get();
        
        // Get upcoming events for the home page
        $upcomingEvents = \App\Models\Event::published()
            ->upcoming()
            ->orderBy('event_date', 'asc')
            ->orderBy('start_time', 'asc')
            ->limit(3)
            ->get();
        
        return Inertia::render('Home', [
            'page' => $homePage,
            'recentNews' => $recentNews,
            'upcomingEvents' => $upcomingEvents,
        ]);
    }

    /**
     * Display the about us page.
     */
    public function about()
    {
        $aboutPage = Page::where('slug', 'about')->published()->first();
        
        return Inertia::render('About', [
            'page' => $aboutPage,
        ]);
    }

    /**
     * Display a specific page by slug.
     */
    public function show(Page $page)
    {
        if (!$page->isPublished()) {
            abort(404);
        }

        return Inertia::render('Page', [
            'page' => $page,
        ]);
    }
}