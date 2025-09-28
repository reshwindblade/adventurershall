<?php

namespace App\Http\Controllers;

use App\Http\Requests\ContactRequest;
use App\Models\ContactInquiry;
use Inertia\Inertia;

class ContactController extends Controller
{
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
        ContactInquiry::create($request->validated());

        return redirect()->back()->with('success', 'Thank you for your message! We will get back to you soon.');
    }
}