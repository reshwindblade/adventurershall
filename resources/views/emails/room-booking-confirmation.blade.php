<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Room Booking Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #000000 0%, #1f2937 50%, #000000 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
        }
        .header .highlight {
            color: #ec4899;
        }
        .content {
            background: #ffffff;
            padding: 30px 20px;
            border: 1px solid #e5e7eb;
            border-top: none;
        }
        .booking-details {
            background: #f9fafb;
            border-left: 4px solid #ec4899;
            padding: 20px;
            margin: 20px 0;
            border-radius: 0 4px 4px 0;
        }
        .booking-details h3 {
            color: #be185d;
            margin-top: 0;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .detail-label {
            font-weight: bold;
            color: #374151;
        }
        .detail-value {
            color: #6b7280;
        }
        .total-cost {
            background: #fdf2f8;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
            text-align: center;
        }
        .total-cost .amount {
            font-size: 24px;
            font-weight: bold;
            color: #be185d;
        }
        .footer {
            background: #f3f4f6;
            padding: 20px;
            text-align: center;
            border-radius: 0 0 8px 8px;
            border: 1px solid #e5e7eb;
            border-top: none;
            font-size: 14px;
            color: #6b7280;
        }
        .contact-info {
            margin: 20px 0;
            padding: 15px;
            background: #fdf2f8;
            border-radius: 6px;
        }
        .contact-info h3 {
            color: #be185d;
            margin-top: 0;
        }
        .btn {
            display: inline-block;
            background: #ec4899;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            margin: 15px 0;
        }
        .important-note {
            background: #fef3cd;
            border: 1px solid #f59e0b;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
        }
        .important-note h4 {
            color: #92400e;
            margin-top: 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Adventurers' <span class="highlight">Hall</span></h1>
        <p>Room Booking Confirmation</p>
    </div>

    <div class="content">
        <h2>Hello {{ $user->name }},</h2>
        
        <p>Great news! Your room booking at Adventurers' Hall has been confirmed. We're excited to host your gaming session!</p>

        <div class="booking-details">
            <h3>Booking Details</h3>
            
            <div class="detail-row">
                <span class="detail-label">Booking ID:</span>
                <span class="detail-value">#{{ $booking->id }}</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Room:</span>
                <span class="detail-value">{{ $room->name }}</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Date:</span>
                <span class="detail-value">{{ $booking->booking_date->format('l, F j, Y') }}</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Time:</span>
                <span class="detail-value">{{ $booking->start_time->format('g:i A') }} - {{ $booking->end_time->format('g:i A') }}</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Duration:</span>
                <span class="detail-value">{{ $booking->start_time->diffInHours($booking->end_time) }} hour(s)</span>
            </div>
            
            @if($booking->special_requests)
            <div class="detail-row">
                <span class="detail-label">Special Requests:</span>
                <span class="detail-value">{{ $booking->special_requests }}</span>
            </div>
            @endif
        </div>

        <div class="total-cost">
            <p><strong>Total Cost</strong></p>
            <div class="amount">${{ number_format($booking->total_cost, 2) }}</div>
        </div>

        <div class="important-note">
            <h4>Important Information</h4>
            <ul>
                <li><strong>Arrival:</strong> Please arrive 10 minutes before your booking time</li>
                <li><strong>Cancellation:</strong> Free cancellation up to 24 hours before your booking</li>
                <li><strong>Payment:</strong> Payment will be collected upon arrival</li>
                <li><strong>Capacity:</strong> Maximum {{ $room->capacity }} people in {{ $room->name }}</li>
            </ul>
        </div>

        <div class="contact-info">
            <h3>Contact Information</h3>
            <p><strong>Address:</strong> 123 Adventure Lane, Gaming District, City, State 12345</p>
            <p><strong>Phone:</strong> (555) 123-GAME</p>
            <p><strong>Email:</strong> info@adventurershall.com</p>
            <p><strong>Hours:</strong> Monday - Sunday: 10am - 10pm</p>
        </div>

        <p>If you need to make any changes to your booking or have questions, please contact us at least 24 hours in advance.</p>

        <a href="{{ url('/') }}" class="btn">Visit Our Website</a>
    </div>

    <div class="footer">
        <p>Thank you for choosing Adventurers' Hall for your gaming experience!</p>
        <p>Booking Reference: #{{ $booking->id }}</p>
        <p>&copy; {{ date('Y') }} Adventurers' Hall. All rights reserved.</p>
    </div>
</body>
</html>