<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\HasEnhancedValidation;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    use HasEnhancedValidation;
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:2', 'max:255', 'regex:/^[a-zA-Z\s\'-]+$/'],
            'username' => ['required', 'string', 'min:3', 'max:50', 'unique:users,username', 'regex:/^[a-zA-Z0-9_-]+$/'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::min(8)->letters()->mixedCase()->numbers()],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Please enter your full name.',
            'name.min' => 'Name must be at least 2 characters long.',
            'name.regex' => 'Name can only contain letters, spaces, apostrophes, and hyphens.',
            'username.required' => 'Please choose a username.',
            'username.min' => 'Username must be at least 3 characters long.',
            'username.max' => 'Username cannot exceed 50 characters.',
            'username.unique' => 'This username is already taken. Please choose a different one.',
            'username.regex' => 'Username can only contain letters, numbers, underscores, and hyphens.',
            'email.required' => 'Please enter your email address.',
            'email.email' => 'Please enter a valid email address (e.g., user@example.com).',
            'email.unique' => 'This email address is already registered. Try logging in instead.',
            'password.required' => 'Please create a password.',
            'password.confirmed' => 'Password confirmation doesn\'t match. Please re-enter both passwords.',
            'password.min' => 'Password must be at least 8 characters long for security.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'name' => 'full name',
            'username' => 'username',
            'email' => 'email address',
            'password' => 'password',
            'password_confirmation' => 'password confirmation',
        ];
    }
}