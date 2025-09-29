<?php

namespace Tests\Feature;

use App\Jobs\SendRoomBookingConfirmation;
use App\Models\Room;
use App\Models\RoomBooking;
use App\Models\User;
use App\Services\BookingService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class RoomBookingEmailTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create test data
        $this->user = User::factory()->create();
        $this->room = Room::factory()->create([
            'name' => 'Rose Garden',
            'hourly_rate' => 25.00,
            'is_active' => true,
        ]);
    }

    public function test_room_booking_confirmation_email_is_queued()
    {
        Queue::fake();

        $bookingData = [
            'room_id' => $this->room->id,
            'booking_date' => now()->addDays(2)->toDateString(),
            'start_time' => '14:00',
            'end_time' => '16:00',
            'special_requests' => 'Please prepare D&D materials',
        ];

        $bookingService = app(BookingService::class);
        $booking = $bookingService->createRoomBooking($bookingData, $this->user);

        Queue::assertPushed(SendRoomBookingConfirmation::class, function ($job) use ($booking) {
            return $job->booking->id === $booking->id;
        });
    }

    public function test_room_booking_confirmation_email_contains_correct_data()
    {
        $booking = RoomBooking::factory()->create([
            'user_id' => $this->user->id,
            'room_id' => $this->room->id,
            'booking_date' => now()->addDays(2)->toDateString(),
            'start_time' => '14:00',
            'end_time' => '16:00',
            'total_cost' => 50.00,
            'status' => 'confirmed',
        ]);

        $job = new SendRoomBookingConfirmation($booking);
        
        // Test that the job can be instantiated with the booking
        $this->assertInstanceOf(SendRoomBookingConfirmation::class, $job);
        $this->assertEquals($booking->id, $job->booking->id);
    }

    public function test_email_service_configuration_check()
    {
        $emailService = app(\App\Services\EmailService::class);
        
        // Test configuration status method
        $status = $emailService->getConfigurationStatus();
        
        $this->assertIsArray($status);
        $this->assertArrayHasKey('mailer', $status);
        $this->assertArrayHasKey('is_configured', $status);
    }
}