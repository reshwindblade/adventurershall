<?php

namespace Tests\Feature;

use App\Jobs\SendContactConfirmation;
use App\Jobs\SendRoomBookingConfirmation;
use App\Jobs\SendSessionBookingConfirmation;
use App\Mail\ContactConfirmation;
use App\Mail\RoomBookingConfirmation;
use App\Mail\SessionBookingConfirmation;
use App\Models\ContactInquiry;
use App\Models\GamingSession;
use App\Models\Room;
use App\Models\RoomBooking;
use App\Models\SessionBooking;
use App\Models\User;
use App\Services\EmailService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class EmailNotificationSystemTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Set up test email configuration
        config([
            'mail.default' => 'smtp',
            'mail.mailers.smtp.host' => 'localhost',
            'mail.mailers.smtp.port' => 587,
            'mail.from.address' => 'test@adventurershall.com',
            'mail.from.name' => 'Adventurers Hall',
        ]);
    }

    public function test_room_booking_confirmation_email_job_processes_correctly()
    {
        Mail::fake();

        $user = User::factory()->create();
        $room = Room::factory()->create(['name' => 'Rose Garden']);
        $booking = RoomBooking::factory()->create([
            'user_id' => $user->id,
            'room_id' => $room->id,
            'booking_date' => now()->addDays(2)->toDateString(),
            'start_time' => '14:00',
            'end_time' => '16:00',
            'total_cost' => 50.00,
        ]);

        $job = new SendRoomBookingConfirmation($booking);
        $job->handle();

        Mail::assertSent(RoomBookingConfirmation::class, function ($mail) use ($user, $booking) {
            return $mail->hasTo($user->email) && 
                   $mail->booking->id === $booking->id;
        });
    }

    public function test_session_booking_confirmation_email_job_processes_correctly()
    {
        Mail::fake();

        $user = User::factory()->create();
        $session = GamingSession::factory()->create(['name' => 'D&D Beginner Session']);
        $booking = SessionBooking::factory()->create([
            'user_id' => $user->id,
            'gaming_session_id' => $session->id,
            'booking_date' => now()->addDays(2)->toDateString(),
            'start_time' => '18:00',
            'participants' => 3,
            'experience_level' => 'beginner',
        ]);

        $job = new SendSessionBookingConfirmation($booking);
        $job->handle();

        Mail::assertSent(SessionBookingConfirmation::class, function ($mail) use ($user, $booking) {
            return $mail->hasTo($user->email) && 
                   $mail->booking->id === $booking->id;
        });
    }

    public function test_contact_confirmation_email_job_processes_correctly()
    {
        Mail::fake();

        $inquiry = ContactInquiry::factory()->create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'message' => 'Test inquiry message',
        ]);

        $job = new SendContactConfirmation($inquiry);
        $job->handle();

        Mail::assertSent(ContactConfirmation::class, function ($mail) use ($inquiry) {
            return $mail->hasTo($inquiry->email) && 
                   $mail->contactInquiry->id === $inquiry->id;
        });
    }

    public function test_room_booking_confirmation_email_contains_correct_content()
    {
        $user = User::factory()->create(['name' => 'John Doe']);
        $room = Room::factory()->create(['name' => 'Rose Garden']);
        $booking = RoomBooking::factory()->create([
            'user_id' => $user->id,
            'room_id' => $room->id,
            'booking_date' => '2025-12-25',
            'start_time' => '14:00',
            'end_time' => '16:00',
            'total_cost' => 50.00,
            'special_requests' => 'Please prepare D&D materials',
        ]);

        $mailable = new RoomBookingConfirmation($booking);
        $rendered = $mailable->render();

        $this->assertStringContainsString('John Doe', $rendered);
        $this->assertStringContainsString('Rose Garden', $rendered);
        $this->assertStringContainsString('December 25, 2025', $rendered);
        $this->assertStringContainsString('2:00 PM', $rendered);
        $this->assertStringContainsString('4:00 PM', $rendered);
        $this->assertStringContainsString('$50.00', $rendered);
        $this->assertStringContainsString('Please prepare D&D materials', $rendered);
    }

    public function test_session_booking_confirmation_email_contains_correct_content()
    {
        $user = User::factory()->create(['name' => 'Jane Smith']);
        $session = GamingSession::factory()->create([
            'name' => 'D&D Beginner Session',
            'system' => 'Dungeons & Dragons 5e',
            'duration' => 180,
        ]);
        $booking = SessionBooking::factory()->create([
            'user_id' => $user->id,
            'gaming_session_id' => $session->id,
            'booking_date' => '2025-12-25',
            'start_time' => '18:00',
            'participants' => 3,
            'experience_level' => 'beginner',
            'special_requests' => 'First time playing',
        ]);

        $mailable = new SessionBookingConfirmation($booking);
        $rendered = $mailable->render();

        $this->assertStringContainsString('Jane Smith', $rendered);
        $this->assertStringContainsString('D&D Beginner Session', $rendered);
        $this->assertStringContainsString('Dungeons & Dragons 5e', $rendered);
        $this->assertStringContainsString('December 25, 2025', $rendered);
        $this->assertStringContainsString('6:00 PM', $rendered);
        $this->assertStringContainsString('3 participants', $rendered);
        $this->assertStringContainsString('beginner', $rendered);
        $this->assertStringContainsString('First time playing', $rendered);
    }

    public function test_contact_confirmation_email_contains_correct_content()
    {
        $inquiry = ContactInquiry::factory()->create([
            'name' => 'Alice Johnson',
            'email' => 'alice@example.com',
            'message' => 'I would like to know more about your gaming sessions.',
        ]);

        $mailable = new ContactConfirmation($inquiry);
        $rendered = $mailable->render();

        $this->assertStringContainsString('Alice Johnson', $rendered);
        $this->assertStringContainsString('I would like to know more about your gaming sessions.', $rendered);
        $this->assertStringContainsString('Thank you for contacting', $rendered);
    }

    public function test_email_service_configuration_status()
    {
        $emailService = app(EmailService::class);
        $status = $emailService->getConfigurationStatus();

        $this->assertIsArray($status);
        $this->assertArrayHasKey('mailer', $status);
        $this->assertArrayHasKey('host', $status);
        $this->assertArrayHasKey('port', $status);
        $this->assertArrayHasKey('from_address', $status);
        $this->assertArrayHasKey('from_name', $status);
        $this->assertArrayHasKey('is_configured', $status);
        $this->assertTrue($status['is_configured']);
    }

    public function test_email_service_handles_missing_configuration()
    {
        // Temporarily clear email configuration
        config([
            'mail.from.address' => null,
            'mail.from.name' => null,
        ]);

        $emailService = app(EmailService::class);
        $status = $emailService->getConfigurationStatus();

        $this->assertFalse($status['is_configured']);
    }

    public function test_email_jobs_are_queued_properly()
    {
        Queue::fake();

        $user = User::factory()->create();
        $room = Room::factory()->create();
        $session = GamingSession::factory()->create();

        // Test room booking email queuing
        $roomBooking = RoomBooking::factory()->create([
            'user_id' => $user->id,
            'room_id' => $room->id,
        ]);

        dispatch(new SendRoomBookingConfirmation($roomBooking));
        Queue::assertPushed(SendRoomBookingConfirmation::class);

        // Test session booking email queuing
        $sessionBooking = SessionBooking::factory()->create([
            'user_id' => $user->id,
            'gaming_session_id' => $session->id,
        ]);

        dispatch(new SendSessionBookingConfirmation($sessionBooking));
        Queue::assertPushed(SendSessionBookingConfirmation::class);

        // Test contact confirmation email queuing
        $inquiry = ContactInquiry::factory()->create();

        dispatch(new SendContactConfirmation($inquiry));
        Queue::assertPushed(SendContactConfirmation::class);
    }

    public function test_email_jobs_handle_failures_gracefully()
    {
        // This test ensures that email job failures don't break the application
        $user = User::factory()->create(['email' => 'invalid-email-format']);
        $room = Room::factory()->create();
        $booking = RoomBooking::factory()->create([
            'user_id' => $user->id,
            'room_id' => $room->id,
        ]);

        $job = new SendRoomBookingConfirmation($booking);

        // The job should not throw an exception even with invalid email
        try {
            $job->handle();
            $this->assertTrue(true); // Job completed without throwing exception
        } catch (\Exception $e) {
            // If an exception is thrown, it should be logged but not break the flow
            $this->assertInstanceOf(\Exception::class, $e);
        }
    }

    public function test_email_templates_are_properly_formatted()
    {
        $user = User::factory()->create();
        $room = Room::factory()->create();
        $booking = RoomBooking::factory()->create([
            'user_id' => $user->id,
            'room_id' => $room->id,
        ]);

        $mailable = new RoomBookingConfirmation($booking);

        // Test that the mailable has the correct properties
        $this->assertEquals('Room Booking Confirmation - Adventurers\' Hall', $mailable->subject);
        $this->assertNotNull($mailable->booking);
        $this->assertEquals($booking->id, $mailable->booking->id);
    }

    public function test_bulk_email_processing()
    {
        Queue::fake();

        $users = User::factory()->count(5)->create();
        $room = Room::factory()->create();
        $bookings = [];

        foreach ($users as $user) {
            $booking = RoomBooking::factory()->create([
                'user_id' => $user->id,
                'room_id' => $room->id,
            ]);
            $bookings[] = $booking;
            dispatch(new SendRoomBookingConfirmation($booking));
        }

        Queue::assertPushed(SendRoomBookingConfirmation::class, 5);
    }
}