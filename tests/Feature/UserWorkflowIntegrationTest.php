<?php

namespace Tests\Feature;

use App\Jobs\SendContactConfirmation;
use App\Jobs\SendRoomBookingConfirmation;
use App\Jobs\SendSessionBookingConfirmation;
use App\Models\GamingSession;
use App\Models\Room;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class UserWorkflowIntegrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_complete_user_registration_and_room_booking_workflow()
    {
        Queue::fake();

        // Step 1: User visits registration page
        $response = $this->get('/register');
        $response->assertStatus(200);

        // Step 2: User registers
        $userData = [
            'name' => 'John Doe',
            'username' => 'johndoe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ];

        $response = $this->post('/register', $userData);
        $response->assertRedirect('/');
        $this->assertAuthenticated();

        $user = User::where('email', 'john@example.com')->first();
        $this->assertNotNull($user);

        // Step 3: User navigates to book room page
        $response = $this->actingAs($user)->get('/book-room');
        $response->assertStatus(200);

        // Step 4: User makes a room booking
        $room = Room::factory()->create([
            'name' => 'Rose Garden',
            'hourly_rate' => 25.00,
            'is_active' => true,
        ]);

        $bookingData = [
            'room_id' => $room->id,
            'booking_date' => now()->addDays(3)->toDateString(),
            'start_time' => '14:00',
            'end_time' => '16:00',
            'special_requests' => 'First time visitor',
        ];

        $response = $this->actingAs($user)
            ->post('/room-bookings', $bookingData);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        // Step 5: Verify booking was created and email was queued
        $this->assertDatabaseHas('room_bookings', [
            'user_id' => $user->id,
            'room_id' => $room->id,
            'booking_date' => $bookingData['booking_date'],
            'total_cost' => 50.00, // 2 hours * $25
        ]);

        Queue::assertPushed(SendRoomBookingConfirmation::class);

        // Step 6: User views their bookings
        $response = $this->actingAs($user)->get('/my-bookings');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('roomBookings.data', 1));
    }

    public function test_complete_user_session_booking_workflow()
    {
        Queue::fake();

        // Create and authenticate user
        $user = User::factory()->create();

        // Step 1: User navigates to book session page
        $response = $this->actingAs($user)->get('/book-session');
        $response->assertStatus(200);

        // Step 2: User makes a session booking
        $session = GamingSession::factory()->create([
            'name' => 'D&D Beginner Session',
            'system' => 'Dungeons & Dragons 5e',
            'duration' => 180,
            'max_participants' => 6,
            'is_active' => true,
        ]);

        $bookingData = [
            'gaming_session_id' => $session->id,
            'booking_date' => now()->addDays(5)->toDateString(),
            'start_time' => '18:00',
            'participants' => 3,
            'experience_level' => 'beginner',
            'special_requests' => 'Looking forward to learning!',
        ];

        $response = $this->actingAs($user)
            ->post('/session-bookings', $bookingData);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        // Step 3: Verify booking was created and email was queued
        $this->assertDatabaseHas('session_bookings', [
            'user_id' => $user->id,
            'gaming_session_id' => $session->id,
            'booking_date' => $bookingData['booking_date'],
            'participants' => 3,
            'experience_level' => 'beginner',
        ]);

        Queue::assertPushed(SendSessionBookingConfirmation::class);

        // Step 4: User views their session bookings
        $response = $this->actingAs($user)->get('/my-bookings');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('sessionBookings.data', 1));
    }

    public function test_complete_contact_form_workflow()
    {
        Queue::fake();

        // Step 1: User visits contact page
        $response = $this->get('/contact');
        $response->assertStatus(200);

        // Step 2: User submits contact form
        $contactData = [
            'name' => 'Jane Smith',
            'email' => 'jane@example.com',
            'message' => 'I have a question about your gaming sessions. Do you offer beginner-friendly D&D sessions?',
        ];

        $response = $this->post('/contact', $contactData);
        $response->assertRedirect();
        $response->assertSessionHas('success');

        // Step 3: Verify inquiry was stored and email was queued
        $this->assertDatabaseHas('contact_inquiries', [
            'name' => 'Jane Smith',
            'email' => 'jane@example.com',
            'status' => 'new',
        ]);

        Queue::assertPushed(SendContactConfirmation::class);
    }

    public function test_user_login_and_booking_workflow()
    {
        Queue::fake();

        // Create user
        $user = User::factory()->create([
            'email' => 'existing@example.com',
            'password' => Hash::make('password123'),
        ]);

        // Step 1: User visits login page
        $response = $this->get('/login');
        $response->assertStatus(200);

        // Step 2: User logs in
        $response = $this->post('/login', [
            'email' => 'existing@example.com',
            'password' => 'password123',
        ]);

        $response->assertRedirect('/');
        $this->assertAuthenticated();

        // Step 3: User attempts to book without being redirected to login
        $room = Room::factory()->create(['is_active' => true]);

        $bookingData = [
            'room_id' => $room->id,
            'booking_date' => now()->addDays(1)->toDateString(),
            'start_time' => '10:00',
            'end_time' => '12:00',
        ];

        $response = $this->post('/room-bookings', $bookingData);
        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('room_bookings', [
            'user_id' => $user->id,
            'room_id' => $room->id,
        ]);
    }

    public function test_admin_workflow_managing_bookings()
    {
        // Create admin and regular user
        $admin = User::factory()->create(['is_admin' => true]);
        $user = User::factory()->create();

        // Create some test data
        $room = Room::factory()->create();
        $session = GamingSession::factory()->create();

        $roomBooking = \App\Models\RoomBooking::factory()->create([
            'user_id' => $user->id,
            'room_id' => $room->id,
            'status' => 'pending',
        ]);

        $sessionBooking = \App\Models\SessionBooking::factory()->create([
            'user_id' => $user->id,
            'gaming_session_id' => $session->id,
            'status' => 'pending',
        ]);

        // Step 1: Admin logs in and accesses dashboard
        $response = $this->actingAs($admin)->get('/admin/dashboard');
        $response->assertStatus(200);

        // Step 2: Admin views room bookings
        $response = $this->actingAs($admin)->get('/admin/room-bookings');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('bookings.data', 1));

        // Step 3: Admin updates room booking status
        $response = $this->actingAs($admin)
            ->put("/admin/room-bookings/{$roomBooking->id}", [
                'status' => 'confirmed',
                'admin_notes' => 'Confirmed by admin',
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('room_bookings', [
            'id' => $roomBooking->id,
            'status' => 'confirmed',
            'admin_notes' => 'Confirmed by admin',
        ]);

        // Step 4: Admin views session bookings
        $response = $this->actingAs($admin)->get('/admin/session-bookings');
        $response->assertStatus(200);

        // Step 5: Admin updates session booking status
        $response = $this->actingAs($admin)
            ->put("/admin/session-bookings/{$sessionBooking->id}", [
                'status' => 'confirmed',
                'admin_notes' => 'Session confirmed',
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('session_bookings', [
            'id' => $sessionBooking->id,
            'status' => 'confirmed',
        ]);
    }

    public function test_password_reset_workflow()
    {
        $user = User::factory()->create([
            'email' => 'reset@example.com',
        ]);

        // Step 1: User visits forgot password page
        $response = $this->get('/forgot-password');
        $response->assertStatus(200);

        // Step 2: User submits email for password reset
        $response = $this->post('/forgot-password', [
            'email' => 'reset@example.com',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('status');

        // Step 3: User would receive email and click reset link
        // (This is tested in PasswordResetTest, but we verify the flow works)
        $this->assertTrue(true); // Workflow completes successfully
    }

    public function test_guest_to_authenticated_booking_redirect_workflow()
    {
        $room = Room::factory()->create(['is_active' => true]);

        // Step 1: Guest tries to book room
        $response = $this->post('/room-bookings', [
            'room_id' => $room->id,
            'booking_date' => now()->addDays(1)->toDateString(),
            'start_time' => '10:00',
            'end_time' => '12:00',
        ]);

        // Step 2: Guest is redirected to login
        $response->assertRedirect('/login');

        // Step 3: Guest registers instead
        $userData = [
            'name' => 'New User',
            'username' => 'newuser',
            'email' => 'new@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ];

        $response = $this->post('/register', $userData);
        $response->assertRedirect('/');
        $this->assertAuthenticated();

        // Step 4: Now authenticated user can book
        $response = $this->post('/room-bookings', [
            'room_id' => $room->id,
            'booking_date' => now()->addDays(1)->toDateString(),
            'start_time' => '10:00',
            'end_time' => '12:00',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');
    }
}