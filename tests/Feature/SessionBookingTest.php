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

class SessionBookingTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected GamingSession $session;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::factory()->create();
        $this->session = GamingSession::factory()->create([
            'name' => 'D&D Beginner Session',
            'system' => 'Dungeons & Dragons 5e',
            'duration' => 180, // 3 hours
            'max_participants' => 6,
            'is_active' => true,
        ]);
    }

    public function test_book_session_page_displays_correctly()
    {
        $response = $this->get(route('book-session'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('BookSession'));
    }

    public function test_authenticated_user_can_book_session()
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

        $response = $this->actingAs($this->user)
            ->post(route('session-bookings.store'), $bookingData);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('session_bookings', [
            'user_id' => $this->user->id,
            'gaming_session_id' => $this->session->id,
            'booking_date' => $bookingData['booking_date'],
            'start_time' => $bookingData['start_time'],
            'participants' => $bookingData['participants'],
            'experience_level' => $bookingData['experience_level'],
            'special_requests' => $bookingData['special_requests'],
            'status' => 'confirmed',
        ]);

        Queue::assertPushed(SendSessionBookingConfirmation::class);
    }

    public function test_guest_cannot_book_session()
    {
        $bookingData = [
            'gaming_session_id' => $this->session->id,
            'booking_date' => now()->addDays(2)->toDateString(),
            'start_time' => '14:00',
            'participants' => 2,
            'experience_level' => 'beginner',
        ];

        $response = $this->post(route('session-bookings.store'), $bookingData);

        $response->assertRedirect(route('login'));
    }

    public function test_session_booking_validates_required_fields()
    {
        $response = $this->actingAs($this->user)
            ->post(route('session-bookings.store'), []);

        $response->assertSessionHasErrors([
            'gaming_session_id',
            'booking_date',
            'start_time',
            'participants',
            'experience_level'
        ]);
    }

    public function test_session_booking_validates_date_is_in_future()
    {
        $bookingData = [
            'gaming_session_id' => $this->session->id,
            'booking_date' => now()->subDay()->toDateString(),
            'start_time' => '14:00',
            'participants' => 2,
            'experience_level' => 'beginner',
        ];

        $response = $this->actingAs($this->user)
            ->post(route('session-bookings.store'), $bookingData);

        $response->assertSessionHasErrors(['booking_date']);
    }

    public function test_session_booking_validates_participant_count()
    {
        // Test with 0 participants
        $bookingData = [
            'gaming_session_id' => $this->session->id,
            'booking_date' => now()->addDays(2)->toDateString(),
            'start_time' => '14:00',
            'participants' => 0,
            'experience_level' => 'beginner',
        ];

        $response = $this->actingAs($this->user)
            ->post(route('session-bookings.store'), $bookingData);

        $response->assertSessionHasErrors(['participants']);

        // Test with too many participants
        $bookingData['participants'] = 10; // More than session max (6)

        $response = $this->actingAs($this->user)
            ->post(route('session-bookings.store'), $bookingData);

        $response->assertSessionHasErrors(['participants']);
    }

    public function test_session_booking_validates_experience_level()
    {
        $bookingData = [
            'gaming_session_id' => $this->session->id,
            'booking_date' => now()->addDays(2)->toDateString(),
            'start_time' => '14:00',
            'participants' => 2,
            'experience_level' => 'invalid_level',
        ];

        $response = $this->actingAs($this->user)
            ->post(route('session-bookings.store'), $bookingData);

        $response->assertSessionHasErrors(['experience_level']);
    }

    public function test_session_availability_check()
    {
        $bookingService = app(BookingService::class);

        // Check availability for a new session (should be available)
        $isAvailable = $bookingService->isSessionAvailable(
            $this->session,
            now()->addDays(2)->toDateString(),
            '14:00',
            2
        );

        $this->assertTrue($isAvailable);

        // Create a booking that fills the session
        SessionBooking::factory()->create([
            'gaming_session_id' => $this->session->id,
            'booking_date' => now()->addDays(2)->toDateString(),
            'start_time' => '14:00',
            'participants' => 6, // Max participants
            'status' => 'confirmed',
        ]);

        // Check availability for the same time slot (should not be available)
        $isAvailable = $bookingService->isSessionAvailable(
            $this->session,
            now()->addDays(2)->toDateString(),
            '14:00',
            1
        );

        $this->assertFalse($isAvailable);
    }

    public function test_session_partial_availability()
    {
        $bookingService = app(BookingService::class);

        // Create a booking with 4 participants (session max is 6)
        SessionBooking::factory()->create([
            'gaming_session_id' => $this->session->id,
            'booking_date' => now()->addDays(2)->toDateString(),
            'start_time' => '14:00',
            'participants' => 4,
            'status' => 'confirmed',
        ]);

        // Should be available for 2 more participants
        $isAvailable = $bookingService->isSessionAvailable(
            $this->session,
            now()->addDays(2)->toDateString(),
            '14:00',
            2
        );

        $this->assertTrue($isAvailable);

        // Should not be available for 3 participants (would exceed max)
        $isAvailable = $bookingService->isSessionAvailable(
            $this->session,
            now()->addDays(2)->toDateString(),
            '14:00',
            3
        );

        $this->assertFalse($isAvailable);
    }

    public function test_user_can_view_their_session_bookings()
    {
        $booking = SessionBooking::factory()->create([
            'user_id' => $this->user->id,
            'gaming_session_id' => $this->session->id,
        ]);

        $response = $this->actingAs($this->user)
            ->get(route('session-bookings.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->has('bookings.data', 1)
                ->where('bookings.data.0.id', $booking->id)
        );
    }

    public function test_session_booking_confirmation_page_displays_correctly()
    {
        $booking = SessionBooking::factory()->create([
            'user_id' => $this->user->id,
            'gaming_session_id' => $this->session->id,
        ]);

        $response = $this->actingAs($this->user)
            ->get(route('booking-confirmation', ['type' => 'session', 'id' => $booking->id]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('BookingConfirmation')
                ->where('booking.id', $booking->id)
        );
    }

    public function test_inactive_session_cannot_be_booked()
    {
        $inactiveSession = GamingSession::factory()->create(['is_active' => false]);

        $bookingData = [
            'gaming_session_id' => $inactiveSession->id,
            'booking_date' => now()->addDays(2)->toDateString(),
            'start_time' => '14:00',
            'participants' => 2,
            'experience_level' => 'beginner',
        ];

        $response = $this->actingAs($this->user)
            ->post(route('session-bookings.store'), $bookingData);

        $response->assertSessionHasErrors(['gaming_session_id']);
    }

    public function test_session_booking_duration_calculation()
    {
        $bookingService = app(BookingService::class);

        $bookingData = [
            'gaming_session_id' => $this->session->id,
            'booking_date' => now()->addDays(2)->toDateString(),
            'start_time' => '14:00',
            'participants' => 2,
            'experience_level' => 'beginner',
        ];

        $booking = $bookingService->createSessionBooking($bookingData, $this->user);

        // Session duration is 180 minutes (3 hours)
        $expectedEndTime = '17:00';
        $calculatedEndTime = date('H:i', strtotime($booking->start_time . ' + ' . $this->session->duration . ' minutes'));
        
        $this->assertEquals($expectedEndTime, $calculatedEndTime);
    }
}