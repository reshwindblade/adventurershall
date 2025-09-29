<?php

namespace App\Services;

use App\Jobs\SendContactConfirmation;
use App\Jobs\SendRoomBookingConfirmation;
use App\Jobs\SendSessionBookingConfirmation;
use App\Models\ContactInquiry;
use App\Models\RoomBooking;
use App\Models\SessionBooking;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class EmailService
{
    /**
     * Send room booking confirmation email.
     */
    public function sendRoomBookingConfirmation(RoomBooking $booking): void
    {
        try {
            SendRoomBookingConfirmation::dispatch($booking);
            
            Log::info('Room booking confirmation email queued', [
                'booking_id' => $booking->id,
                'user_id' => $booking->user_id
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to queue room booking confirmation email', [
                'booking_id' => $booking->id,
                'user_id' => $booking->user_id,
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Send session booking confirmation email.
     */
    public function sendSessionBookingConfirmation(SessionBooking $booking): void
    {
        try {
            SendSessionBookingConfirmation::dispatch($booking);
            
            Log::info('Session booking confirmation email queued', [
                'booking_id' => $booking->id,
                'user_id' => $booking->user_id
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to queue session booking confirmation email', [
                'booking_id' => $booking->id,
                'user_id' => $booking->user_id,
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Send contact form confirmation email.
     */
    public function sendContactConfirmation(ContactInquiry $inquiry): void
    {
        try {
            SendContactConfirmation::dispatch($inquiry);
            
            Log::info('Contact confirmation email queued', [
                'inquiry_id' => $inquiry->id,
                'email' => $inquiry->email
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to queue contact confirmation email', [
                'inquiry_id' => $inquiry->id,
                'email' => $inquiry->email,
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Send welcome email to new user.
     */
    public function sendWelcomeEmail(User $user): void
    {
        try {
            // For now, we'll just log this - welcome email can be implemented later
            Log::info('Welcome email should be sent', [
                'user_id' => $user->id,
                'email' => $user->email
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to process welcome email', [
                'user_id' => $user->id,
                'email' => $user->email,
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Check if email service is properly configured.
     */
    public function isConfigured(): bool
    {
        $requiredConfigs = [
            'MAIL_MAILER',
            'MAIL_HOST',
            'MAIL_PORT',
            'MAIL_FROM_ADDRESS',
            'MAIL_FROM_NAME'
        ];

        foreach ($requiredConfigs as $config) {
            if (empty(config("mail.{$config}")) && empty(env($config))) {
                return false;
            }
        }

        return true;
    }

    /**
     * Get email configuration status for debugging.
     */
    public function getConfigurationStatus(): array
    {
        return [
            'mailer' => config('mail.default'),
            'host' => config('mail.mailers.smtp.host'),
            'port' => config('mail.mailers.smtp.port'),
            'from_address' => config('mail.from.address'),
            'from_name' => config('mail.from.name'),
            'is_configured' => $this->isConfigured(),
        ];
    }
}