<?php

namespace App\Observers;

use App\Models\GamingSession;
use App\Services\CacheService;

class GamingSessionObserver
{
    public function __construct(
        private CacheService $cacheService
    ) {}

    /**
     * Handle the GamingSession "created" event.
     */
    public function created(GamingSession $gamingSession): void
    {
        $this->cacheService->clearSessionCache();
    }

    /**
     * Handle the GamingSession "updated" event.
     */
    public function updated(GamingSession $gamingSession): void
    {
        $this->cacheService->clearSessionCache();
    }

    /**
     * Handle the GamingSession "deleted" event.
     */
    public function deleted(GamingSession $gamingSession): void
    {
        $this->cacheService->clearSessionCache();
    }
}