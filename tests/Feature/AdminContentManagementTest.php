<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Page;
use App\Models\NewsArticle;
use App\Models\Event;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdminContentManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create an admin user
        $this->admin = User::factory()->create([
            'is_admin' => true,
        ]);
        
        // Create a regular user
        $this->user = User::factory()->create([
            'is_admin' => false,
        ]);
    }

    public function test_admin_can_access_pages_index()
    {
        $response = $this->actingAs($this->admin)
            ->get('/admin/pages');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Admin/Pages/Index'));
    }

    public function test_regular_user_cannot_access_admin_pages()
    {
        $response = $this->actingAs($this->user)
            ->get('/admin/pages');

        $response->assertStatus(403);
    }

    public function test_admin_can_create_page()
    {
        $pageData = [
            'title' => 'Test Page',
            'slug' => 'test-page',
            'content' => '<p>This is test content</p>',
            'meta_description' => 'Test meta description',
            'is_published' => true,
        ];

        $response = $this->actingAs($this->admin)
            ->post('/admin/pages', $pageData);

        $response->assertRedirect('/admin/pages');
        $this->assertDatabaseHas('pages', $pageData);
    }

    public function test_admin_can_access_news_index()
    {
        $response = $this->actingAs($this->admin)
            ->get('/admin/news');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Admin/News/Index'));
    }

    public function test_admin_can_create_news_article()
    {
        Storage::fake('public');

        $articleData = [
            'title' => 'Test Article',
            'slug' => 'test-article',
            'content' => '<p>This is test article content</p>',
            'excerpt' => 'Test excerpt',
            'is_published' => true,
            'published_at' => now()->format('Y-m-d\TH:i'),
        ];

        $response = $this->actingAs($this->admin)
            ->post('/admin/news', $articleData);

        $response->assertRedirect('/admin/news');
        $this->assertDatabaseHas('news_articles', [
            'title' => 'Test Article',
            'slug' => 'test-article',
            'is_published' => true,
        ]);
    }

    public function test_admin_can_create_news_article_with_image()
    {
        Storage::fake('public');

        $image = UploadedFile::fake()->image('test.jpg');

        $articleData = [
            'title' => 'Test Article with Image',
            'slug' => 'test-article-image',
            'content' => '<p>This is test article content</p>',
            'excerpt' => 'Test excerpt',
            'featured_image' => $image,
            'is_published' => true,
        ];

        $response = $this->actingAs($this->admin)
            ->post('/admin/news', $articleData);

        $response->assertRedirect('/admin/news');
        
        $article = NewsArticle::where('slug', 'test-article-image')->first();
        $this->assertNotNull($article);
        $this->assertNotNull($article->featured_image);
        
        Storage::disk('public')->assertExists($article->featured_image);
    }

    public function test_admin_can_access_events_index()
    {
        $response = $this->actingAs($this->admin)
            ->get('/admin/events');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Admin/Events/Index'));
    }

    public function test_admin_can_create_event()
    {
        $eventData = [
            'title' => 'Test Event',
            'slug' => 'test-event',
            'description' => '<p>This is a test event</p>',
            'event_date' => '2025-12-25',
            'start_time' => '18:00',
            'end_time' => '22:00',
            'location' => 'Rose Garden',
            'max_participants' => 6,
            'registration_required' => true,
            'is_published' => true,
        ];

        $response = $this->actingAs($this->admin)
            ->post('/admin/events', $eventData);

        $response->assertRedirect('/admin/events');
        $this->assertDatabaseHas('events', [
            'title' => 'Test Event',
            'slug' => 'test-event',
            'is_published' => true,
        ]);
    }

    public function test_admin_can_edit_page()
    {
        $page = Page::factory()->create([
            'title' => 'Original Title',
            'slug' => 'original-slug',
        ]);

        $updateData = [
            'title' => 'Updated Title',
            'slug' => 'updated-slug',
            'content' => '<p>Updated content</p>',
            'meta_description' => 'Updated meta',
            'is_published' => true,
        ];

        $response = $this->actingAs($this->admin)
            ->put("/admin/pages/{$page->slug}", $updateData);

        $response->assertRedirect('/admin/pages');
        $this->assertDatabaseHas('pages', [
            'id' => $page->id,
            'title' => 'Updated Title',
            'slug' => 'updated-slug',
        ]);
    }

    public function test_page_validation_requires_title_and_content()
    {
        $response = $this->actingAs($this->admin)
            ->post('/admin/pages', [
                'slug' => 'test-slug',
                'meta_description' => 'Test meta',
                'is_published' => false,
            ]);

        $response->assertSessionHasErrors(['title', 'content']);
    }

    public function test_news_validation_requires_title_and_content()
    {
        $response = $this->actingAs($this->admin)
            ->post('/admin/news', [
                'slug' => 'test-slug',
                'excerpt' => 'Test excerpt',
                'is_published' => false,
            ]);

        $response->assertSessionHasErrors(['title', 'content']);
    }

    public function test_event_validation_requires_required_fields()
    {
        $response = $this->actingAs($this->admin)
            ->post('/admin/events', [
                'slug' => 'test-slug',
                'location' => 'Test location',
                'is_published' => false,
            ]);

        $response->assertSessionHasErrors(['title', 'description', 'event_date', 'start_time']);
    }
}