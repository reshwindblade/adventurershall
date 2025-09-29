<?php

namespace Tests\Feature;

use App\Models\ContactInquiry;
use App\Models\Event;
use App\Models\NewsArticle;
use App\Models\Room;
use App\Models\RoomBooking;
use App\Models\SessionBooking;
use App\Models\User;
use App\Models\GamingSession;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminDashboardTest extends TestCase
{
    use RefreshDatabase;
    
    protected $seed = false;
    use RefreshDatabase;

    public function test_admin_can_access_dashboard(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);

        $response = $this->actingAs($admin)->get('/admin/dashboard');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Admin/Dashboard'));
    }

    public function test_regular_user_cannot_access_admin_dashboard(): void
    {
        $user = User::factory()->create(['is_admin' => false]);

        $response = $this->actingAs($user)->get('/admin/dashboard');

        $response->assertStatus(403);
    }

    public function test_guest_cannot_access_admin_dashboard(): void
    {
        $response = $this->get('/admin/dashboard');

        $response->assertRedirect('/login');
    }

    public function test_admin_dashboard_displays_correct_statistics(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        
        // Create test data
        User::factory()->count(5)->create();
        
        $room = Room::factory()->create();
        RoomBooking::factory()->count(3)->create(['room_id' => $room->id]);
        
        $session = GamingSession::factory()->create();
        SessionBooking::factory()->count(2)->create(['gaming_session_id' => $session->id]);
        
        ContactInquiry::factory()->count(4)->create(['status' => 'pending']);
        ContactInquiry::factory()->count(2)->create(['status' => 'resolved']);
        
        NewsArticle::factory()->count(3)->create(['is_published' => true]);
        Event::factory()->count(2)->create(['is_published' => true]);

        $response = $this->actingAs($admin)->get('/admin/dashboard');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Dashboard')
            ->has('stats')
            ->has('stats.total_users')
            ->has('stats.total_room_bookings')
            ->has('stats.total_session_bookings')
            ->has('stats.pending_contact_inquiries')
            ->has('stats.published_news_articles')
            ->has('stats.published_events')
            ->has('stats.recent_room_bookings')
            ->has('stats.recent_session_bookings')
            ->has('stats.recent_contact_inquiries')
        );
        
        // Verify that the statistics are greater than or equal to what we created
        $stats = $response->getOriginalContent()->getData()['page']['props']['stats'];
        $this->assertGreaterThanOrEqual(6, $stats['total_users']);
        $this->assertGreaterThanOrEqual(3, $stats['total_room_bookings']);
        $this->assertGreaterThanOrEqual(2, $stats['total_session_bookings']);
        $this->assertGreaterThanOrEqual(4, $stats['pending_contact_inquiries']);
        $this->assertGreaterThanOrEqual(3, $stats['published_news_articles']);
        $this->assertGreaterThanOrEqual(2, $stats['published_events']);
    }

    public function test_admin_dashboard_shows_recent_activity(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $user = User::factory()->create();
        
        $room = Room::factory()->create();
        $session = GamingSession::factory()->create();
        
        // Create recent bookings
        RoomBooking::factory()->create([
            'user_id' => $user->id,
            'room_id' => $room->id,
        ]);
        
        SessionBooking::factory()->create([
            'user_id' => $user->id,
            'gaming_session_id' => $session->id,
        ]);
        
        ContactInquiry::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'message' => 'Test message',
        ]);

        $response = $this->actingAs($admin)->get('/admin/dashboard');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Dashboard')
            ->has('stats.recent_room_bookings', 1)
            ->has('stats.recent_session_bookings', 1)
            ->has('stats.recent_contact_inquiries', 1)
        );
    }
}