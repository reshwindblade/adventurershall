<?php

namespace Tests\Feature;

use App\Jobs\SendContactConfirmation;
use App\Mail\ContactConfirmation;
use App\Models\ContactInquiry;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class ContactEmailTest extends TestCase
{
    use RefreshDatabase;

    public function test_contact_confirmation_email_is_sent()
    {
        Mail::fake();

        $contactInquiry = ContactInquiry::create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'message' => 'This is a test message.',
            'status' => 'new'
        ]);

        // Dispatch the job
        SendContactConfirmation::dispatch($contactInquiry);

        // Assert the email was sent
        Mail::assertSent(ContactConfirmation::class, function ($mail) use ($contactInquiry) {
            return $mail->contactInquiry->id === $contactInquiry->id;
        });
    }

    public function test_contact_confirmation_email_has_correct_content()
    {
        $contactInquiry = ContactInquiry::create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'message' => 'This is a test message for email content.',
            'status' => 'new'
        ]);

        $mail = new ContactConfirmation($contactInquiry);

        // Test the envelope
        $envelope = $mail->envelope();
        $this->assertEquals('Thank you for contacting Adventurers\' Hall', $envelope->subject);

        // Test the content
        $content = $mail->content();
        $this->assertEquals('emails.contact-confirmation', $content->view);
        $this->assertEquals('John Doe', $content->with['name']);
        $this->assertEquals('This is a test message for email content.', $content->with['message']);
        $this->assertEquals($contactInquiry->id, $content->with['inquiryId']);
    }

    public function test_contact_confirmation_email_renders_correctly()
    {
        Mail::fake();

        $contactInquiry = ContactInquiry::create([
            'name' => 'Jane Smith',
            'email' => 'jane@example.com',
            'message' => 'I have a question about your services.',
            'status' => 'new'
        ]);

        // Send the email
        Mail::to($contactInquiry->email)->send(new ContactConfirmation($contactInquiry));

        // Assert the email was sent with correct recipient
        Mail::assertSent(ContactConfirmation::class, function ($mail) use ($contactInquiry) {
            return $mail->hasTo($contactInquiry->email) &&
                   $mail->contactInquiry->name === 'Jane Smith' &&
                   $mail->contactInquiry->message === 'I have a question about your services.';
        });
    }
}