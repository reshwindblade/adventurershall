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
        
        return Inertia::render('Home', [
            'page' => $homePage,
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