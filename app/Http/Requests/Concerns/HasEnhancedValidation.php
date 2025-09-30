<?php

namespace App\Http\Requests\Concerns;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

trait HasEnhancedValidation
{
    /**
     * Handle a failed validation attempt.
     */
    protected function failedValidation(Validator $validator)
    {
        $errors = $validator->errors();
        
        // Add contextual error information
        $enhancedErrors = $this->enhanceValidationErrors($errors->toArray());
        
        if ($this->expectsJson() || $this->wantsJson()) {
            throw new HttpResponseException(
                response()->json([
                    'message' => 'The given data was invalid.',
                    'errors' => $enhancedErrors,
                    'error_count' => count($enhancedErrors),
                ], 422)
            );
        }

        throw (new ValidationException($validator))
            ->errorBag($this->errorBag)
            ->redirectTo($this->getRedirectUrl());
    }

    /**
     * Enhance validation errors with additional context.
     */
    protected function enhanceValidationErrors(array $errors): array
    {
        $enhanced = [];
        
        foreach ($errors as $field => $messages) {
            $enhanced[$field] = $this->enhanceFieldErrors($field, $messages);
        }
        
        return $enhanced;
    }

    /**
     * Enhance errors for a specific field.
     */
    protected function enhanceFieldErrors(string $field, array $messages): string
    {
        // Return the first error message (most important)
        $primaryMessage = $messages[0] ?? 'Invalid value.';
        
        // Add field-specific enhancements
        return $this->addFieldContext($field, $primaryMessage);
    }

    /**
     * Add contextual information to field errors.
     */
    protected function addFieldContext(string $field, string $message): string
    {
        $contextualMessages = [
            'email' => [
                'format' => 'Please enter a valid email address (e.g., user@example.com).',
                'unique' => 'This email address is already registered. Try logging in instead.',
            ],
            'password' => [
                'min' => 'Password must be at least 8 characters long for security.',
                'confirmed' => 'Password confirmation doesn\'t match. Please re-enter both passwords.',
            ],
            'username' => [
                'unique' => 'This username is already taken. Please choose a different one.',
                'format' => 'Username can only contain letters, numbers, underscores, and hyphens.',
            ],
            'booking_date' => [
                'future' => 'Bookings can only be made for today or future dates.',
            ],
            'start_time' => [
                'format' => 'Please enter time in HH:MM format (e.g., 14:30).',
                'business_hours' => 'Bookings are only available between 9:00 AM and 11:00 PM.',
            ],
            'end_time' => [
                'after' => 'End time must be after the start time.',
                'business_hours' => 'Bookings must end by 11:00 PM.',
            ],
        ];

        // Check if we have a contextual message for this field and error type
        if (isset($contextualMessages[$field])) {
            foreach ($contextualMessages[$field] as $type => $contextMessage) {
                if (stripos($message, $type) !== false || $this->messageMatchesType($message, $type)) {
                    return $contextMessage;
                }
            }
        }

        return $message;
    }

    /**
     * Check if a message matches a specific error type.
     */
    protected function messageMatchesType(string $message, string $type): bool
    {
        $patterns = [
            'format' => ['format', 'invalid', 'must be'],
            'unique' => ['already', 'taken', 'exists'],
            'min' => ['at least', 'minimum'],
            'max' => ['exceed', 'maximum'],
            'required' => ['required', 'must'],
            'confirmed' => ['confirmation', 'match'],
            'future' => ['future', 'after'],
            'business_hours' => ['business', 'hours', '9:00', '11:00'],
        ];

        if (!isset($patterns[$type])) {
            return false;
        }

        foreach ($patterns[$type] as $pattern) {
            if (stripos($message, $pattern) !== false) {
                return true;
            }
        }

        return false;
    }

    /**
     * Get validation error suggestions for common issues.
     */
    protected function getValidationSuggestions(string $field, string $error): array
    {
        $suggestions = [
            'email' => [
                'Check for typos in your email address',
                'Make sure you include @ and a domain (e.g., .com)',
                'Try using a different email address',
            ],
            'password' => [
                'Use a mix of uppercase and lowercase letters',
                'Include at least one number',
                'Add special characters for extra security',
                'Make sure both password fields match exactly',
            ],
            'booking_date' => [
                'Select today\'s date or a future date',
                'Check that the date format is correct',
                'Ensure the selected date is not in the past',
            ],
            'start_time' => [
                'Use 24-hour format (e.g., 14:30 for 2:30 PM)',
                'Choose a time between 9:00 AM and 11:00 PM',
                'Make sure the time slot is available',
            ],
        ];

        return $suggestions[$field] ?? [];
    }
}