<?php

namespace App\Jobs;

use App\Mail\RoomBookingConfirmation;
use App\Models\RoomBooking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class SendRoomBookingConfirmation implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     *
     * @var int
     */
    public $tries = 3;

    /**
     * The maximum number of seconds the job can run.
     *
     * @var int
     */
    public $timeout = 60;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public RoomBooking $booking
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            // Load the booking with relationships
            $this->booking->load(['user', 'room']);
            
            Mail::to($this->booking->user->email)
                ->send(new RoomBookingConfirmation($this->booking));
                
            Log::info('Room booking confirmation email sent successfully', [
                'booking_id' => $this->booking->id,
                'user_id' => $this->booking->user_id,
                'email' => $this->booking->user->email,
                'room' => $this->booking->room->name
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to send room booking confirmation email', [
                'booking_id' => $this->booking->id,
                'user_id' => $this->booking->user_id,
                'email' => $this->booking->user->email ?? 'unknown',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            // Re-throw the exception to trigger job retry
            throw $e;
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('Room booking confirmation email job failed permanently', [
            'booking_id' => $this->booking->id,
            'user_id' => $this->booking->user_id,
            'error' => $exception->getMessage(),
            'attempts' => $this->attempts()
        ]);
    }
}