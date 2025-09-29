<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactInquiry;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactInquiryController extends Controller
{
    /**
     * Display a listing of contact inquiries.
     */
    public function index(Request $request)
    {
        $query = ContactInquiry::query();

        // Apply filters
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('date_from')) {
            $query->where('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->where('created_at', '<=', $request->date_to . ' 23:59:59');
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('message', 'like', "%{$search}%");
            });
        }

        $inquiries = $query->orderBy('created_at', 'desc')
                          ->paginate(15)
                          ->withQueryString();

        // Get filter options
        $statusOptions = ContactInquiry::getStatusOptions();

        return Inertia::render('Admin/ContactInquiries/Index', [
            'inquiries' => $inquiries,
            'statusOptions' => $statusOptions,
            'filters' => $request->only(['status', 'date_from', 'date_to', 'search'])
        ]);
    }

    /**
     * Display the specified contact inquiry.
     */
    public function show(ContactInquiry $contactInquiry)
    {
        return Inertia::render('Admin/ContactInquiries/Show', [
            'inquiry' => $contactInquiry
        ]);
    }

    /**
     * Update the specified contact inquiry.
     */
    public function update(Request $request, ContactInquiry $contactInquiry)
    {
        $request->validate([
            'status' => 'required|in:pending,new,in_progress,resolved',
            'admin_notes' => 'nullable|string|max:2000'
        ]);

        $contactInquiry->update([
            'status' => $request->status,
            'admin_notes' => $request->admin_notes
        ]);

        return redirect()->back()->with('success', 'Contact inquiry updated successfully.');
    }
}