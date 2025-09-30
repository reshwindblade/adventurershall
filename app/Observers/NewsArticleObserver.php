<?php

namespace App\Observers;

use App\Models\NewsArticle;
use App\Services\CacheService;

class NewsArticleObserver
{
    public function __construct(
        private CacheService $cacheService
    ) {}

    /**
     * Handle the NewsArticle "created" event.
     */
    public function created(NewsArticle $newsArticle): void
    {
        $this->cacheService->clearContentCache();
    }

    /**
     * Handle the NewsArticle "updated" event.
     */
    public function updated(NewsArticle $newsArticle): void
    {
        $this->cacheService->clearContentCache();
    }

    /**
     * Handle the NewsArticle "deleted" event.
     */
    public function deleted(NewsArticle $newsArticle): void
    {
        $this->cacheService->clearContentCache();
    }
}