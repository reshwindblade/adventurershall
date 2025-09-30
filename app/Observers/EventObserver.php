<?php

namespace App\Observers;

use App\Models\Event;
use App\Services\CacheService;

class EventObserver
{
    public function __construct(
        private CacheService $cacheService
    ) {}

    /**
     * Handle the Event "created" event.
     */
    public function created(Event $event): void
    {
        $this->cacheService->clearContentCache();
    }

    /**
     * Handle the Event "updated" event.
     */
    public function updated(Event $event): void
    {
        $this->cacheService->clearContentCache();
    }

    /**
     * Handle the Event "deleted" event.
     */
    public function deleted(Event $event): void
    {
        $this->cacheService->clearContentCache();
    }
}