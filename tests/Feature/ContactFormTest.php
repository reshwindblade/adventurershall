<?php

namespace Tests\Feature;

use App\Jobs\SendContactConfirmation;
use App\Models\ContactInquiry;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class ContactFormTest extends TestCase
{
    use RefreshDatabase;

    public function test_contact_page_displays_correctly()
    {
        $response = $this->get(route('contact'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Contact'));
    }

    public function test_contact_form_stores_inquiry_and_dispatches_email()
    {
        Queue::fake();

        $contactData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'message' => 'This is a test message for the contact form.'
        ];

        $response = $this->post(route('contact.store'), $contactData);

        // Assert the inquiry was stored
        $this->assertDatabaseHas('contact_inquiries', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'message' => 'This is a test message for the contact form.',
            'status' => 'new'
        ]);

        // Assert the email job was dispatched
        Queue::assertPushed(SendContactConfirmation::class, function ($job) {
            return $job->contactInquiry->email === 'john@example.com';
        });

        // Assert redirect with success message
        $response->assertRedirect();
        $response->assertSessionHas('success');
    }

    public function test_contact_form_validates_required_fields()
    {
        $response = $this->post(route('contact.store'), []);

        $response->assertSessionHasErrors(['name', 'email', 'message']);
    }

    public function test_contact_form_validates_email_format()
    {
        $response = $this->post(route('contact.store'), [
            'name' => 'John Doe',
            'email' => 'invalid-email',
            'message' => 'Test message'
        ]);

        $response->assertSessionHasErrors(['email']);
    }

    public function test_contact_form_validates_message_length()
    {
        $response = $this->post(route('contact.store'), [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'message' => str_repeat('a', 2001) // Exceeds 2000 character limit
        ]);

        $response->assertSessionHasErrors(['message']);
    }

    public function test_contact_inquiry_model_has_correct_fillable_fields()
    {
        $inquiry = new ContactInquiry();
        
        $expectedFillable = ['name', 'email', 'message', 'status', 'admin_notes'];
        
        $this->assertEquals($expectedFillable, $inquiry->getFillable());
    }

    public function test_contact_inquiry_status_scopes()
    {
        ContactInquiry::create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'message' => 'Test message',
            'status' => 'new'
        ]);

        ContactInquiry::create([
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'message' => 'Another test message',
            'status' => 'resolved'
        ]);

        $newInquiries = ContactInquiry::new()->get();
        $resolvedInquiries = ContactInquiry::resolved()->get();

        $this->assertCount(1, $newInquiries);
        $this->assertCount(1, $resolvedInquiries);
        $this->assertEquals('new', $newInquiries->first()->status);
        $this->assertEquals('resolved', $resolvedInquiries->first()->status);
    }
}