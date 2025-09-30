<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add indexes for room_bookings table
        Schema::table('room_bookings', function (Blueprint $table) {
            $table->index(['booking_date', 'status'], 'room_bookings_date_status_idx');
            $table->index(['user_id', 'status'], 'room_bookings_user_status_idx');
            $table->index(['room_id', 'booking_date'], 'room_bookings_room_date_idx');
            $table->index('created_at', 'room_bookings_created_at_idx');
        });

        // Add indexes for session_bookings table
        Schema::table('session_bookings', function (Blueprint $table) {
            $table->index(['booking_date', 'status'], 'session_bookings_date_status_idx');
            $table->index(['user_id', 'status'], 'session_bookings_user_status_idx');
            $table->index(['gaming_session_id', 'booking_date'], 'session_bookings_session_date_idx');
            $table->index('experience_level', 'session_bookings_experience_idx');
            $table->index('created_at', 'session_bookings_created_at_idx');
        });

        // Add indexes for users table
        Schema::table('users', function (Blueprint $table) {
            $table->index('is_admin', 'users_is_admin_idx');
            $table->index('created_at', 'users_created_at_idx');
        });

        // Add indexes for news_articles table
        Schema::table('news_articles', function (Blueprint $table) {
            $table->index(['is_published', 'published_at'], 'news_published_date_idx');
            $table->index('created_at', 'news_created_at_idx');
        });

        // Add indexes for events table
        Schema::table('events', function (Blueprint $table) {
            $table->index(['is_published', 'event_date'], 'events_published_date_idx');
            $table->index('event_date', 'events_date_idx');
            $table->index('created_at', 'events_created_at_idx');
        });

        // Add indexes for pages table
        Schema::table('pages', function (Blueprint $table) {
            $table->index('is_published', 'pages_published_idx');
            $table->index('updated_at', 'pages_updated_at_idx');
        });

        // Add indexes for contact_inquiries table
        Schema::table('contact_inquiries', function (Blueprint $table) {
            $table->index('status', 'contact_inquiries_status_idx');
            $table->index('created_at', 'contact_inquiries_created_at_idx');
        });

        // Add indexes for rooms table
        Schema::table('rooms', function (Blueprint $table) {
            $table->index('is_active', 'rooms_is_active_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop indexes for room_bookings table
        Schema::table('room_bookings', function (Blueprint $table) {
            $table->dropIndex('room_bookings_date_status_idx');
            $table->dropIndex('room_bookings_user_status_idx');
            $table->dropIndex('room_bookings_room_date_idx');
            $table->dropIndex('room_bookings_created_at_idx');
        });

        // Drop indexes for session_bookings table
        Schema::table('session_bookings', function (Blueprint $table) {
            $table->dropIndex('session_bookings_date_status_idx');
            $table->dropIndex('session_bookings_user_status_idx');
            $table->dropIndex('session_bookings_session_date_idx');
            $table->dropIndex('session_bookings_experience_idx');
            $table->dropIndex('session_bookings_created_at_idx');
        });

        // Drop indexes for users table
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex('users_is_admin_idx');
            $table->dropIndex('users_created_at_idx');
        });

        // Drop indexes for news_articles table
        Schema::table('news_articles', function (Blueprint $table) {
            $table->dropIndex('news_published_date_idx');
            $table->dropIndex('news_created_at_idx');
        });

        // Drop indexes for events table
        Schema::table('events', function (Blueprint $table) {
            $table->dropIndex('events_published_date_idx');
            $table->dropIndex('events_date_idx');
            $table->dropIndex('events_created_at_idx');
        });

        // Drop indexes for pages table
        Schema::table('pages', function (Blueprint $table) {
            $table->dropIndex('pages_published_idx');
            $table->dropIndex('pages_updated_at_idx');
        });

        // Drop indexes for contact_inquiries table
        Schema::table('contact_inquiries', function (Blueprint $table) {
            $table->dropIndex('contact_inquiries_status_idx');
            $table->dropIndex('contact_inquiries_created_at_idx');
        });

        // Drop indexes for rooms table
        Schema::table('rooms', function (Blueprint $table) {
            $table->dropIndex('rooms_is_active_idx');
        });
    }
};