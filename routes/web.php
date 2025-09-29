<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\RoomBookingController;
use App\Http\Controllers\SocialAuthController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public Pages
Route::get('/', [PageController::class, 'home'])->name('home');
Route::get('/about', [PageController::class, 'about'])->name('about');
Route::get('/contact', [ContactController::class, 'show'])->name('contact');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');

// News Routes
Route::get('/news', [NewsController::class, 'index'])->name('news.index');
Route::get('/news/{article}', [NewsController::class, 'show'])->name('news.show');

// Events Routes
Route::get('/events', [EventController::class, 'index'])->name('events.index');
Route::get('/events/{event}', [EventController::class, 'show'])->name('events.show');

// Room Booking Routes
Route::get('/book-room', [RoomBookingController::class, 'index'])->name('rooms.index');
Route::get('/book-room/{room}', [RoomBookingController::class, 'show'])->name('rooms.show');
Route::get('/rooms/{room}/availability', [RoomBookingController::class, 'availability'])->name('rooms.availability');

// Dynamic Pages
Route::get('/pages/{page}', [PageController::class, 'show'])->name('pages.show');

Route::get('/component-test', function () {
    return Inertia::render('ComponentTest');
});

// Authentication Routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);
    
    Route::get('/forgot-password', [PasswordResetController::class, 'showForgotPassword'])->name('password.request');
    Route::post('/forgot-password', [PasswordResetController::class, 'forgotPassword'])->name('password.email');
    
    Route::get('/reset-password/{token}', [PasswordResetController::class, 'showResetPassword'])->name('password.reset');
    Route::post('/reset-password', [PasswordResetController::class, 'resetPassword'])->name('password.update');
    
    // Social Authentication Routes
    Route::get('/auth/google', [SocialAuthController::class, 'redirectToGoogle'])->name('auth.google');
    Route::get('/auth/google/callback', [SocialAuthController::class, 'handleGoogleCallback']);
    
    Route::get('/auth/facebook', [SocialAuthController::class, 'redirectToFacebook'])->name('auth.facebook');
    Route::get('/auth/facebook/callback', [SocialAuthController::class, 'handleFacebookCallback']);
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    
    // Authenticated Room Booking Routes
    Route::post('/book-room', [RoomBookingController::class, 'store'])->name('rooms.store');
    Route::get('/bookings/{booking}/confirmation', [RoomBookingController::class, 'confirmation'])->name('bookings.confirmation');
});

// Admin Routes
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
    
    // Content Management Routes
    Route::resource('pages', \App\Http\Controllers\Admin\PageController::class);
    Route::resource('news', \App\Http\Controllers\Admin\NewsController::class);
    Route::resource('events', \App\Http\Controllers\Admin\EventController::class);
    
    // Booking Management Routes
    Route::resource('room-bookings', \App\Http\Controllers\Admin\RoomBookingController::class)->only(['index', 'show', 'update']);
    Route::resource('session-bookings', \App\Http\Controllers\Admin\SessionBookingController::class)->only(['index', 'show', 'update']);
    
    // Contact Inquiry Management Routes
    Route::resource('contact-inquiries', \App\Http\Controllers\Admin\ContactInquiryController::class)->only(['index', 'show', 'update']);
});
