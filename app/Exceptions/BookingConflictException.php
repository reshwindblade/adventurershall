<?php

namespace App\Exceptions;

use Exception;

class BookingConflictException extends Exception
{
    protected $message = 'The requested time slot is not available.';
}