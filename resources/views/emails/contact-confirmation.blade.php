<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank you for contacting us</title>
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
        .message-box {
            background: #f9fafb;
            border-left: 4px solid #ec4899;
            padding: 15px 20px;
            margin: 20px 0;
            border-radius: 0 4px 4px 0;
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
    </style>
</head>
<body>
    <div class="header">
        <h1>Adventurers' <span class="highlight">Hall</span></h1>
        <p>Thank you for reaching out to us!</p>
    </div>

    <div class="content">
        <h2>Hello {{ $name }},</h2>
        
        <p>Thank you for contacting Adventurers' Hall! We've received your message and wanted to confirm that it has been successfully submitted.</p>

        <div class="message-box">
            <h3>Your Message:</h3>
            <p>{{ $message }}</p>
        </div>

        <p><strong>What happens next?</strong></p>
        <ul>
            <li>Our team will review your message within 24 hours</li>
            <li>We'll respond to you at the email address you provided</li>
            <li>For urgent matters, feel free to call us at (555) 123-GAME</li>
        </ul>

        <div class="contact-info">
            <h3>Contact Information</h3>
            <p><strong>Address:</strong> 123 Adventure Lane, Gaming District, City, State 12345</p>
            <p><strong>Phone:</strong> (555) 123-GAME</p>
            <p><strong>Email:</strong> info@adventurershall.com</p>
            <p><strong>Hours:</strong> Monday - Sunday: 10am - 10pm</p>
        </div>

        <p>In the meantime, feel free to explore our website to learn more about our rooms, sessions, and upcoming events!</p>

        <a href="{{ url('/') }}" class="btn">Visit Our Website</a>
    </div>

    <div class="footer">
        <p>This is an automated confirmation email. Please do not reply to this message.</p>
        <p>Reference ID: #{{ $inquiryId }}</p>
        <p>&copy; {{ date('Y') }} Adventurers' Hall. All rights reserved.</p>
    </div>
</body>
</html>