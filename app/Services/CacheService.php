<?php

namespace App\Services;

use App\Models\Room;
use App\Models\GamingSession;
use App\Models\Page;
use App\Models\NewsArticle;
use App\Models\Event;
use Illuminate\Support\Facades\Cache;

class CacheService
{
    /**
     * Cache duration in seconds (1 hour)
     */
    const CACHE_DURATION = 3600;

    /**
     * Get cached active rooms
     */
    public function getActiveRooms()
    {
        return Cache::remember('active_rooms', self::CACHE_DURATION, function () {
            return Room::active()
                ->select(['id', 'name', 'slug', 'description', 'capacity', 'hourly_rate', 'image_path'])
                ->get();
        });
    }

    /**
     * Get cached gaming sessions
     */
    public function getGamingSessions()
    {
        return Cache::remember('gaming_sessions', self::CACHE_DURATION, function () {
            return GamingSession::select(['id', 'name', 'system', 'description', 'duration', 'max_participants', 'difficulty_level'])
                ->where('is_active', true)
                ->get();
        });
    }

    /**
     * Get cached published pages
     */
    public function getPublishedPages()
    {
        return Cache::remember('published_pages', self::CACHE_DURATION, function () {
            return Page::where('is_published', true)
                ->select(['id', 'slug', 'title', 'content', 'meta_description'])
                ->get()
                ->keyBy('slug');
        });
    }

    /**
     * Get cached recent news articles
     */
    public function getRecentNews($limit = 5)
    {
        return Cache::remember("recent_news_{$limit}", self::CACHE_DURATION, function () use ($limit) {
            return NewsArticle::published()
                ->select(['id', 'title', 'slug', 'excerpt', 'featured_image', 'published_at'])
                ->orderBy('published_at', 'desc')
                ->limit($limit)
                ->get();
        });
    }

    /**
     * Get cached upcoming events
     */
    public function getUpcomingEvents($limit = 5)
    {
        return Cache::remember("upcoming_events_{$limit}", self::CACHE_DURATION, function () use ($limit) {
            return Event::published()
                ->where('event_date', '>=', now()->toDateString())
                ->select(['id', 'title', 'slug', 'description', 'event_date', 'start_time', 'end_time', 'location', 'featured_image'])
                ->orderBy('event_date', 'asc')
                ->limit($limit)
                ->get();
        });
    }

    /**
     * Clear all cached data
     */
    public function clearAll()
    {
        $keys = [
            'active_rooms',
            'gaming_sessions',
            'published_pages',
            'recent_news_5',
            'upcoming_events_5',
            'rooms_filter_options',
            'gaming_sessions_filter_options'
        ];

        foreach ($keys as $key) {
            Cache::forget($key);
        }
    }

    /**
     * Clear room-related cache
     */
    public function clearRoomCache()
    {
        Cache::forget('active_rooms');
        Cache::forget('rooms_filter_options');
    }

    /**
     * Clear session-related cache
     */
    public function clearSessionCache()
    {
        Cache::forget('gaming_sessions');
        Cache::forget('gaming_sessions_filter_options');
    }

    /**
     * Clear content-related cache
     */
    public function clearContentCache()
    {
        Cache::forget('published_pages');
        Cache::forget('recent_news_5');
        Cache::forget('upcoming_events_5');
    }
}