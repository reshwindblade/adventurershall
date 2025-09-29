<?php

namespace Tests\Feature;

use App\Models\ContactInquiry;
use App\Models\GamingSession;
use App\Models\Room;
use App\Models\RoomBooking;
use App\Models\SessionBooking;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminBookingManagementTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->admin = User::factory()->create(['is_admin' => true]);
        $this->user = User::factory()->create();
    }

    public function test_admin_can_view_room_bookings_index()
    {
        $room = Room::factory()->create();
        $booking = RoomBooking::factory()->create([
            'user_id' => $this->user->id,
            'room_id' => $room->id,
        ]);

        $response = $this->actingAs($this->admin)
            ->get(route('admin.room-bookings.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Admin/Bookings/RoomBookings/Index')
                ->has('bookings.data', 1)
                ->where('bookings.data.0.id', $booking->id)
        );
    }

    public function test_admin_can_view_room_booking_details()
    {
        $room = Room::factory()->create();
        $booking = RoomBooking::factory()->create([
            'user_id' => $this->user->id,
            'room_id' => $room->id,
        ]);

        $response = $this->actingAs($this->admin)
            ->get(route('admin.room-bookings.show', $booking));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Admin/Bookings/RoomBookings/Show')
                ->where('booking.id', $booking->id)
        );
    }

    public function test_admin_can_update_room_booking_status()
    {
        $room = Room::factory()->create();
        $booking = RoomBooking::factory()->create([
            'user_id' => $this->user->id,
            'room_id' => $room->id,
            'status' => 'pending',
        ]);

        $response = $this->actingAs($this->admin)
            ->put(route('admin.room-bookings.update', $booking), [
                'status' => 'confirmed',
                'admin_notes' => 'Booking confirmed by admin',
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('room_bookings', [
            'id' => $booking->id,
            'status' => 'confirmed',
            'admin_notes' => 'Booking confirmed by admin',
        ]);
    }

    public function test_admin_can_view_session_bookings_index()
    {
        $session = GamingSession::factory()->create();
        $booking = SessionBooking::factory()->create([
            'user_id' => $this->user->id,
            'gaming_session_id' => $session->id,
        ]);

        $response = $this->actingAs($this->admin)
            ->get(route('admin.session-bookings.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Admin/Bookings/SessionBookings/Index')
                ->has('bookings.data', 1)
                ->where('bookings.data.0.id', $booking->id)
        );
    }

    public function test_admin_can_view_session_booking_details()
    {
        $session = GamingSession::factory()->create();
        $booking = SessionBooking::factory()->create([
            'user_id' => $this->user->id,
            'gaming_session_id' => $session->id,
        ]);

        $response = $this->actingAs($this->admin)
            ->get(route('admin.session-bookings.show', $booking));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Admin/Bookings/SessionBookings/Show')
                ->where('booking.id', $booking->id)
        );
    }

    public function test_admin_can_update_session_booking_status()
    {
        $session = GamingSession::factory()->create();
        $booking = SessionBooking::factory()->create([
            'user_id' => $this->user->id,
            'gaming_session_id' => $session->id,
            'status' => 'pending',
        ]);

        $response = $this->actingAs($this->admin)
            ->put(route('admin.session-bookings.update', $booking), [
                'status' => 'confirmed',
                'admin_notes' => 'Session confirmed by admin',
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('session_bookings', [
            'id' => $booking->id,
            'status' => 'confirmed',
            'admin_notes' => 'Session confirmed by admin',
        ]);
    }

    public function test_admin_can_view_contact_inquiries_index()
    {
        $inquiry = ContactInquiry::factory()->create();

        $response = $this->actingAs($this->admin)
            ->get(route('admin.contact-inquiries.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Admin/ContactInquiries/Index')
                ->has('inquiries.data', 1)
                ->where('inquiries.data.0.id', $inquiry->id)
        );
    }

    public function test_admin_can_view_contact_inquiry_details()
    {
        $inquiry = ContactInquiry::factory()->create();

        $response = $this->actingAs($this->admin)
            ->get(route('admin.contact-inquiries.show', $inquiry));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Admin/ContactInquiries/Show')
                ->where('inquiry.id', $inquiry->id)
        );
    }

    public function test_admin_can_update_contact_inquiry_status()
    {
        $inquiry = ContactInquiry::factory()->create([
            'status' => 'pending',
        ]);

        $response = $this->actingAs($this->admin)
            ->put(route('admin.contact-inquiries.update', $inquiry), [
                'status' => 'resolved',
                'admin_notes' => 'Issue resolved via phone call',
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('contact_inquiries', [
            'id' => $inquiry->id,
            'status' => 'resolved',
            'admin_notes' => 'Issue resolved via phone call',
        ]);
    }

    public function test_admin_can_filter_room_bookings()
    {
        $room1 = Room::factory()->create(['name' => 'Rose Garden']);
        $room2 = Room::factory()->create(['name' => 'Obsidian Sanctuary']);
        
        $booking1 = RoomBooking::factory()->create([
            'user_id' => $this->user->id,
            'room_id' => $room1->id,
            'status' => 'confirmed',
        ]);
        
        $booking2 = RoomBooking::factory()->create([
            'user_id' => $this->user->id,
            'room_id' => $room2->id,
            'status' => 'pending',
        ]);

        // Filter by status
        $response = $this->actingAs($this->admin)
            ->get(route('admin.room-bookings.index', ['status' => 'confirmed']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->has('bookings.data', 1)
                ->where('bookings.data.0.id', $booking1->id)
        );

        // Filter by room
        $response = $this->actingAs($this->admin)
            ->get(route('admin.room-bookings.index', ['room_id' => $room2->id]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->has('bookings.data', 1)
                ->where('bookings.data.0.id', $booking2->id)
        );
    }

    public function test_admin_can_search_contact_inquiries()
    {
        $inquiry1 = ContactInquiry::factory()->create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'message' => 'Question about room availability',
        ]);
        
        $inquiry2 = ContactInquiry::factory()->create([
            'name' => 'Jane Smith',
            'email' => 'jane@example.com',
            'message' => 'Feedback about the service',
        ]);

        // Search by name
        $response = $this->actingAs($this->admin)
            ->get(route('admin.contact-inquiries.index', ['search' => 'John']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->has('inquiries.data', 1)
                ->where('inquiries.data.0.id', $inquiry1->id)
        );

        // Search by message content
        $response = $this->actingAs($this->admin)
            ->get(route('admin.contact-inquiries.index', ['search' => 'availability']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->has('inquiries.data', 1)
                ->where('inquiries.data.0.id', $inquiry1->id)
        );
    }

    public function test_non_admin_cannot_access_booking_management()
    {
        $response = $this->actingAs($this->user)
            ->get(route('admin.room-bookings.index'));

        $response->assertStatus(403);
    }

    public function test_guest_cannot_access_booking_management()
    {
        $response = $this->get(route('admin.room-bookings.index'));

        $response->assertRedirect(route('login'));
    }
}