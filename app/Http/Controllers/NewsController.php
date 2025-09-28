<?php

namespace App\Http\Controllers;

use App\Models\NewsArticle;
use Inertia\Inertia;

class NewsController extends Controller
{
    /**
     * Display a listing of published news articles.
     */
    public function index()
    {
        $articles = NewsArticle::published()
            ->latest()
            ->paginate(10);

        return Inertia::render('News/Index', [
            'articles' => $articles,
        ]);
    }

    /**
     * Display the specified news article.
     */
    public function show(NewsArticle $article)
    {
        if (!$article->isPublished()) {
            abort(404);
        }

        return Inertia::render('News/Show', [
            'article' => $article,
        ]);
    }
}