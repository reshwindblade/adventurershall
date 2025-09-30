<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Register model observers for cache invalidation
        \App\Models\Room::observe(\App\Observers\RoomObserver::class);
        \App\Models\Page::observe(\App\Observers\PageObserver::class);
        \App\Models\NewsArticle::observe(\App\Observers\NewsArticleObserver::class);
        \App\Models\Event::observe(\App\Observers\EventObserver::class);
        \App\Models\GamingSession::observe(\App\Observers\GamingSessionObserver::class);
    }
}
