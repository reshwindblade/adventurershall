<?php

namespace App\Jobs;

use App\Mail\ContactConfirmation;
use App\Models\ContactInquiry;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class SendContactConfirmation implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public ContactInquiry $contactInquiry
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            Mail::to($this->contactInquiry->email)
                ->send(new ContactConfirmation($this->contactInquiry));
                
            Log::info('Contact confirmation email sent successfully', [
                'inquiry_id' => $this->contactInquiry->id,
                'email' => $this->contactInquiry->email
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to send contact confirmation email', [
                'inquiry_id' => $this->contactInquiry->id,
                'email' => $this->contactInquiry->email,
                'error' => $e->getMessage()
            ]);
            
            // Don't fail the job, just log the error
            // The contact inquiry was still saved successfully
        }
    }
}