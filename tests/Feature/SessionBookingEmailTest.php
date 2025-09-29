<?php

namespace Tests\Feature;

use App\Jobs\SendSessionBookingConfirmation;
use App\Models\GamingSession;
use App\Models\SessionBooking;
use App\Models\User;
use App\Services\BookingService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class SessionBookingEmailTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create test data
        $this->user = User::factory()->create();
        $this->session = GamingSession::factory()->create([
            'name' => 'D&D Beginner Session',
            'system' => 'Dungeons & Dragons 5e',
            'duration' => 180, // 3 hours
            'max_participants' => 6,
            'is_active' => true,
        ]);
    }

    public function test_session_booking_confirmation_email_is_queued()
    {
        Queue::fake();

        $bookingData = [
            'gaming_session_id' => $this->session->id,
            'booking_date' => now()->addDays(2)->toDateString(),
            'start_time' => '14:00',
            'participants' => 2,
            'experience_level' => 'beginner',
            'special_requests' => 'First time playing',
        ];

        $bookingService = app(BookingService::class);
        $booking = $bookingService->createSessionBooking($bookingData, $this->user);

        Queue::assertPushed(SendSessionBookingConfirmation::class, function ($job) use ($booking) {
            return $job->booking->id === $booking->id;
        });
    }

    public function test_session_booking_confirmation_email_contains_correct_data()
    {
        $booking = SessionBooking::factory()->create([
            'user_id' => $this->user->id,
            'gaming_session_id' => $this->session->id,
            'booking_date' => now()->addDays(2)->toDateString(),
            'start_time' => '14:00',
            'participants' => 2,
            'experience_level' => 'beginner',
            'status' => 'confirmed',
        ]);

        $job = new SendSessionBookingConfirmation($booking);
        
        // Test that the job can be instantiated with the booking
        $this->assertInstanceOf(SendSessionBookingConfirmation::class, $job);
        $this->assertEquals($booking->id, $job->booking->id);
    }

    public function test_session_availability_calculation()
    {
        $bookingService = app(BookingService::class);
        
        // Test availability for a new session (should be available)
        $isAvailable = $bookingService->isSessionAvailable(
            $this->session,
            now()->addDays(2)->toDateString(),
            '14:00',
            2
        );
        
        $this->assertTrue($isAvailable);
        
        // Test that we can't book more participants than the session allows
        $isAvailable = $bookingService->isSessionAvailable(
            $this->session,
            now()->addDays(2)->toDateString(),
            '14:00',
            10 // More than the session's max_participants (6)
        );
        
        $this->assertFalse($isAvailable, 'Should not be available when requesting more participants than session maximum');
    }
}