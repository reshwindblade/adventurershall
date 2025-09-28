<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactInquiry extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'message',
        'status',
        'admin_notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the status options.
     */
    public static function getStatusOptions(): array
    {
        return [
            'new' => 'New',
            'in_progress' => 'In Progress',
            'resolved' => 'Resolved',
        ];
    }

    /**
     * Scope a query to only include new inquiries.
     */
    public function scopeNew($query)
    {
        return $query->where('status', 'new');
    }

    /**
     * Scope a query to only include resolved inquiries.
     */
    public function scopeResolved($query)
    {
        return $query->where('status', 'resolved');
    }
}