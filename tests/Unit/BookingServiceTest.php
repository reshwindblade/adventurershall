<?php

namespace Tests\Unit;

use App\Models\GamingSession;
use App\Models\Room;
use App\Models\RoomBooking;
use App\Models\SessionBooking;
use App\Models\User;
use App\Services\BookingService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BookingServiceTest extends TestCase
{
    use RefreshDatabase;

    protected BookingService $bookingService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->bookingService = app(BookingService::class);
    }

    public function test_calculates_room_booking_cost_correctly()
    {
        $room = Room::factory()->create(['hourly_rate' => 25.00]);
        
        // Test 2-hour booking
        $cost = $this->bookingService->calculateRoomBookingCost($room, '14:00', '16:00');
        $this->assertEquals(50.00, $cost);
        
        // Test 1-hour booking
        $cost = $this->bookingService->calculateRoomBookingCost($room, '14:00', '15:00');
        $this->assertEquals(25.00, $cost);
        
        // Test 30-minute booking (should round up to 1 hour)
        $cost = $this->bookingService->calculateRoomBookingCost($room, '14:00', '14:30');
        $this->assertEquals(25.00, $cost);
        
        // Test 3.5-hour booking
        $cost = $this->bookingService->calculateRoomBookingCost($room, '14:00', '17:30');
        $this->assertEquals(87.50, $cost);
    }

    public function test_checks_room_availability_correctly()
    {
        $room = Room::factory()->create();
        $user = User::factory()->create();
        
        // No existing bookings - should be available
        $isAvailable = $this->bookingService->isRoomAvailable(
            $room,
            now()->addDays(1)->toDateString(),
            '14:00',
            '16:00'
        );
        $this->assertTrue($isAvailable);
        
        // Create a booking
        RoomBooking::factory()->create([
            'room_id' => $room->id,
            'booking_date' => now()->addDays(1)->toDateString(),
            'start_time' => '14:00',
            'end_time' => '16:00',
            'status' => 'confirmed',
        ]);
        
        // Same time slot - should not be available
        $isAvailable = $this->bookingService->isRoomAvailable(
            $room,
            now()->addDays(1)->toDateString(),
            '14:00',
            '16:00'
        );
        $this->assertFalse($isAvailable);
        
        // Overlapping time slot - should not be available
        $isAvailable = $this->bookingService->isRoomAvailable(
            $room,
            now()->addDays(1)->toDateString(),
            '15:00',
            '17:00'
        );
        $this->assertFalse($isAvailable);
        
        // Non-overlapping time slot - should be available
        $isAvailable = $this->bookingService->isRoomAvailable(
            $room,
            now()->addDays(1)->toDateString(),
            '17:00',
            '19:00'
        );
        $this->assertTrue($isAvailable);
    }

    public function test_checks_session_availability_correctly()
    {
        $session = GamingSession::factory()->create(['max_participants' => 6]);
        $user = User::factory()->create();
        
        // No existing bookings - should be available
        $isAvailable = $this->bookingService->isSessionAvailable(
            $session,
            now()->addDays(1)->toDateString(),
            '14:00',
            2
        );
        $this->assertTrue($isAvailable);
        
        // Create a booking with 4 participants
        SessionBooking::factory()->create([
            'gaming_session_id' => $session->id,
            'booking_date' => now()->addDays(1)->toDateString(),
            'start_time' => '14:00',
            'participants' => 4,
            'status' => 'confirmed',
        ]);
        
        // Request 2 more participants (total 6) - should be available
        $isAvailable = $this->bookingService->isSessionAvailable(
            $session,
            now()->addDays(1)->toDateString(),
            '14:00',
            2
        );
        $this->assertTrue($isAvailable);
        
        // Request 3 more participants (total 7) - should not be available
        $isAvailable = $this->bookingService->isSessionAvailable(
            $session,
            now()->addDays(1)->toDateString(),
            '14:00',
            3
        );
        $this->assertFalse($isAvailable);
    }

    public function test_creates_room_booking_correctly()
    {
        $user = User::factory()->create();
        $room = Room::factory()->create(['hourly_rate' => 30.00]);
        
        $bookingData = [
            'room_id' => $room->id,
            'booking_date' => now()->addDays(2)->toDateString(),
            'start_time' => '10:00',
            'end_time' => '13:00',
            'special_requests' => 'Please prepare board games',
        ];
        
        $booking = $this->bookingService->createRoomBooking($bookingData, $user);
        
        $this->assertInstanceOf(RoomBooking::class, $booking);
        $this->assertEquals($user->id, $booking->user_id);
        $this->assertEquals($room->id, $booking->room_id);
        $this->assertEquals($bookingData['booking_date'], $booking->booking_date);
        $this->assertEquals($bookingData['start_time'], $booking->start_time);
        $this->assertEquals($bookingData['end_time'], $booking->end_time);
        $this->assertEquals($bookingData['special_requests'], $booking->special_requests);
        $this->assertEquals(90.00, $booking->total_cost); // 3 hours * $30
        $this->assertEquals('confirmed', $booking->status);
    }

    public function test_creates_session_booking_correctly()
    {
        $user = User::factory()->create();
        $session = GamingSession::factory()->create([
            'duration' => 180, // 3 hours
            'max_participants' => 8,
        ]);
        
        $bookingData = [
            'gaming_session_id' => $session->id,
            'booking_date' => now()->addDays(2)->toDateString(),
            'start_time' => '18:00',
            'participants' => 4,
            'experience_level' => 'intermediate',
            'special_requests' => 'Looking forward to learning new systems',
        ];
        
        $booking = $this->bookingService->createSessionBooking($bookingData, $user);
        
        $this->assertInstanceOf(SessionBooking::class, $booking);
        $this->assertEquals($user->id, $booking->user_id);
        $this->assertEquals($session->id, $booking->gaming_session_id);
        $this->assertEquals($bookingData['booking_date'], $booking->booking_date);
        $this->assertEquals($bookingData['start_time'], $booking->start_time);
        $this->assertEquals($bookingData['participants'], $booking->participants);
        $this->assertEquals($bookingData['experience_level'], $booking->experience_level);
        $this->assertEquals($bookingData['special_requests'], $booking->special_requests);
        $this->assertEquals('confirmed', $booking->status);
    }

    public function test_handles_booking_conflicts()
    {
        $room = Room::factory()->create();
        $user = User::factory()->create();
        
        // Create existing booking
        RoomBooking::factory()->create([
            'room_id' => $room->id,
            'booking_date' => now()->addDays(1)->toDateString(),
            'start_time' => '14:00',
            'end_time' => '16:00',
            'status' => 'confirmed',
        ]);
        
        $bookingData = [
            'room_id' => $room->id,
            'booking_date' => now()->addDays(1)->toDateString(),
            'start_time' => '15:00',
            'end_time' => '17:00',
        ];
        
        $this->expectException(\App\Exceptions\BookingConflictException::class);
        $this->bookingService->createRoomBooking($bookingData, $user);
    }

    public function test_ignores_cancelled_bookings_for_availability()
    {
        $room = Room::factory()->create();
        
        // Create cancelled booking
        RoomBooking::factory()->create([
            'room_id' => $room->id,
            'booking_date' => now()->addDays(1)->toDateString(),
            'start_time' => '14:00',
            'end_time' => '16:00',
            'status' => 'cancelled',
        ]);
        
        // Should be available despite cancelled booking
        $isAvailable = $this->bookingService->isRoomAvailable(
            $room,
            now()->addDays(1)->toDateString(),
            '14:00',
            '16:00'
        );
        $this->assertTrue($isAvailable);
    }

    public function test_gets_available_time_slots_for_room()
    {
        $room = Room::factory()->create();
        
        // Create existing booking
        RoomBooking::factory()->create([
            'room_id' => $room->id,
            'booking_date' => now()->addDays(1)->toDateString(),
            'start_time' => '14:00',
            'end_time' => '16:00',
            'status' => 'confirmed',
        ]);
        
        $availableSlots = $this->bookingService->getAvailableTimeSlots(
            $room,
            now()->addDays(1)->toDateString()
        );
        
        $this->assertIsArray($availableSlots);
        $this->assertNotContains('14:00', $availableSlots);
        $this->assertNotContains('15:00', $availableSlots);
        $this->assertContains('10:00', $availableSlots);
        $this->assertContains('17:00', $availableSlots);
    }

    public function test_calculates_session_end_time()
    {
        $session = GamingSession::factory()->create(['duration' => 180]); // 3 hours
        
        $endTime = $this->bookingService->calculateSessionEndTime($session, '14:00');
        $this->assertEquals('17:00', $endTime);
        
        $endTime = $this->bookingService->calculateSessionEndTime($session, '18:30');
        $this->assertEquals('21:30', $endTime);
    }
}