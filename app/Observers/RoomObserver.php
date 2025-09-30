<?php

namespace App\Observers;

use App\Models\Room;
use App\Services\CacheService;

class RoomObserver
{
    public function __construct(
        private CacheService $cacheService
    ) {}

    /**
     * Handle the Room "created" event.
     */
    public function created(Room $room): void
    {
        $this->cacheService->clearRoomCache();
    }

    /**
     * Handle the Room "updated" event.
     */
    public function updated(Room $room): void
    {
        $this->cacheService->clearRoomCache();
    }

    /**
     * Handle the Room "deleted" event.
     */
    public function deleted(Room $room): void
    {
        $this->cacheService->clearRoomCache();
    }
}