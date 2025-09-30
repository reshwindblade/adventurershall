<?php

namespace App\Observers;

use App\Models\Page;
use App\Services\CacheService;

class PageObserver
{
    public function __construct(
        private CacheService $cacheService
    ) {}

    /**
     * Handle the Page "created" event.
     */
    public function created(Page $page): void
    {
        $this->cacheService->clearContentCache();
    }

    /**
     * Handle the Page "updated" event.
     */
    public function updated(Page $page): void
    {
        $this->cacheService->clearContentCache();
    }

    /**
     * Handle the Page "deleted" event.
     */
    public function deleted(Page $page): void
    {
        $this->cacheService->clearContentCache();
    }
}