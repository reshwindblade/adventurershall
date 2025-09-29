<?php

namespace App\Http\Controllers;

use App\Http\Requests\ContactRequest;
use App\Models\ContactInquiry;
use App\Services\EmailService;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    public function __construct(
        private EmailService $emailService
    ) {}
    /**
     * Display the contact form.
     */
    public function show()
    {
        return Inertia::render('Contact');
    }

    /**
     * Store a new contact inquiry.
     */
    public function store(ContactRequest $request)
    {
        try {
            // Create the contact inquiry
            $contactInquiry = ContactInquiry::create([
                ...$request->validated(),
                'status' => 'new'
            ]);

            // Send confirmation email
            $this->emailService->sendContactConfirmation($contactInquiry);

            Log::info('Contact inquiry created successfully', [
                'inquiry_id' => $contactInquiry->id,
                'email' => $contactInquiry->email
            ]);

            return redirect()->back()->with('success', 
                'Thank you for your message! We\'ve received your inquiry and sent a confirmation to your email. We\'ll get back to you within 24 hours.'
            );

        } catch (\Exception $e) {
            Log::error('Failed to create contact inquiry', [
                'error' => $e->getMessage(),
                'request_data' => $request->validated()
            ]);

            return redirect()->back()
                ->withErrors(['general' => 'Sorry, there was an error submitting your message. Please try again or contact us directly.'])
                ->withInput();
        }
    }
}