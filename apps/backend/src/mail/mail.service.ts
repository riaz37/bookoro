
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });
    }

    async sendOtpEmail(name: string, email: string, otp: string) {
        console.log(`[MailService] Sending OTP to ${email}...`);

        const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table role="presentation" cellspacing="0" cellpadding="0" width="100%" style="background-color: #f8fafc;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" width="480" style="margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%); padding: 40px 30px; text-align: center;">
                            <div style="font-size: 32px; font-weight: bold; color: #ffffff; letter-spacing: -1px;">✈️ Bookoro</div>
                            <div style="color: rgba(255,255,255,0.9); font-size: 14px; margin-top: 8px;">Your Gateway to Adventure</div>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h1 style="margin: 0 0 20px 0; color: #1e293b; font-size: 24px; font-weight: 700; text-align: center;">Verify Your Email</h1>
                            <p style="margin: 0 0 24px 0; color: #64748b; font-size: 16px; line-height: 1.6; text-align: center;">
                                Hi <strong style="color: #1e293b;">${name}</strong>,<br>
                                Welcome to Bookoro! Use the code below to verify your email address:
                            </p>
                            
                            <!-- OTP Box -->
                            <table role="presentation" cellspacing="0" cellpadding="0" width="100%">
                                <tr>
                                    <td style="padding: 24px; background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%); border-radius: 12px; text-align: center;">
                                        <div style="font-size: 42px; font-weight: 800; color: #ffffff; letter-spacing: 12px; font-family: 'Courier New', monospace;">${otp}</div>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 24px 0 0 0; color: #94a3b8; font-size: 14px; text-align: center;">
                                ⏱️ This code expires in <strong>10 minutes</strong>
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 24px 30px; background-color: #f8fafc; border-top: 1px solid #e2e8f0;">
                            <p style="margin: 0; color: #94a3b8; font-size: 12px; text-align: center; line-height: 1.5;">
                                If you didn't create an account with Bookoro, you can safely ignore this email.
                            </p>
                            <p style="margin: 16px 0 0 0; color: #cbd5e1; font-size: 11px; text-align: center;">
                                © 2024 Bookoro. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        `;

        await this.transporter.sendMail({
            from: '"Bookoro" <noreply@bookoro.com>',
            to: email,
            subject: '🔐 Your Verification Code - Bookoro',
            html,
        });
        console.log(`[MailService] ✅ OTP sent to ${email}`);
    }

    async sendBookingConfirmation(email: string, bookingId: string, flightDetails: any, userName: string) {
        console.log(`[MailService] Sending booking confirmation to ${email}...`);

        const formatDate = (dateStr: string) => {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
        };

        const formatTime = (dateStr: string) => {
            const date = new Date(dateStr);
            return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        };

        const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table role="presentation" cellspacing="0" cellpadding="0" width="100%" style="background-color: #f8fafc;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" width="540" style="margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center;">
                            <div style="font-size: 48px; margin-bottom: 16px;">🎉</div>
                            <div style="font-size: 28px; font-weight: bold; color: #ffffff;">Booking Confirmed!</div>
                            <div style="color: rgba(255,255,255,0.9); font-size: 14px; margin-top: 8px;">Your adventure awaits</div>
                        </td>
                    </tr>
                    
                    <!-- Greeting -->
                    <tr>
                         <td style="padding: 30px 30px 0 30px; text-align: center;">
                            <p style="margin: 0; color: #1e293b; font-size: 18px; font-weight: 600;">Hi ${userName || 'Traveler'},</p>
                            <p style="margin: 8px 0 0 0; color: #64748b; font-size: 14px;">Your flight has been successfully booked. Here are your details:</p>
                        </td>
                    </tr>

                    <!-- Booking Reference -->
                    <tr>
                        <td style="padding: 20px 30px 0 30px; text-align: center;">
                            <p style="margin: 0; color: #64748b; font-size: 14px;">Booking Reference</p>
                            <p style="margin: 8px 0 0 0; font-size: 24px; font-weight: 800; color: #1e293b; letter-spacing: 2px;">${bookingId.slice(0, 8).toUpperCase()}</p>
                        </td>
                    </tr>
                    
                    <!-- Flight Ticket Style -->
                    <tr>
                        <td style="padding: 30px;">
                            <table role="presentation" cellspacing="0" cellpadding="0" width="100%" style="background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%); border-radius: 12px; overflow: hidden;">
                                <!-- Route -->
                                <tr>
                                    <td style="padding: 30px;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" width="100%">
                                            <tr>
                                                <td style="text-align: left; width: 35%;">
                                                    <div style="font-size: 32px; font-weight: 800; color: #ffffff;">${flightDetails.origin?.match(/\(([A-Z]{3})\)/)?.[1] || 'DEP'}</div>
                                                    <div style="color: rgba(255,255,255,0.8); font-size: 12px; margin-top: 4px;">${flightDetails.origin || 'Origin'}</div>
                                                </td>
                                                <td style="text-align: center; width: 30%;">
                                                    <div style="color: rgba(255,255,255,0.6); font-size: 12px;">✈️ Direct</div>
                                                </td>
                                                <td style="text-align: right; width: 35%;">
                                                    <div style="font-size: 32px; font-weight: 800; color: #ffffff;">${flightDetails.destination?.match(/\(([A-Z]{3})\)/)?.[1] || 'ARR'}</div>
                                                    <div style="color: rgba(255,255,255,0.8); font-size: 12px; margin-top: 4px;">${flightDetails.destination || 'Destination'}</div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                
                                <!-- Divider -->
                                <tr>
                                    <td style="padding: 0 20px;">
                                        <div style="border-top: 2px dashed rgba(255,255,255,0.3);"></div>
                                    </td>
                                </tr>
                                
                                <!-- Details -->
                                <tr>
                                    <td style="padding: 24px 30px;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" width="100%">
                                            <tr>
                                                <td style="width: 50%;">
                                                    <div style="color: rgba(255,255,255,0.7); font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Date</div>
                                                    <div style="color: #ffffff; font-size: 16px; font-weight: 600; margin-top: 4px;">${flightDetails.departureTime ? formatDate(flightDetails.departureTime) : 'TBD'}</div>
                                                </td>
                                                <td style="width: 50%; text-align: right;">
                                                    <div style="color: rgba(255,255,255,0.7); font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Time</div>
                                                    <div style="color: #ffffff; font-size: 16px; font-weight: 600; margin-top: 4px;">${flightDetails.departureTime ? formatTime(flightDetails.departureTime) : 'TBD'}</div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Price -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <table role="presentation" cellspacing="0" cellpadding="0" width="100%" style="background-color: #f8fafc; border-radius: 12px; padding: 20px;">
                                <tr>
                                    <td style="padding: 20px; text-align: center;">
                                        <div style="color: #64748b; font-size: 14px;">Total Amount Paid</div>
                                        <div style="color: #1e293b; font-size: 36px; font-weight: 800; margin-top: 8px;">$${flightDetails.price || '0.00'}</div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Next Steps -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <p style="margin: 0 0 16px 0; color: #1e293b; font-size: 16px; font-weight: 600;">What's Next?</p>
                            <table role="presentation" cellspacing="0" cellpadding="0" width="100%">
                                <tr>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                                        <span style="color: #3b82f6; font-weight: bold;">1.</span>
                                        <span style="color: #64748b; margin-left: 12px;">Save this email as your booking confirmation</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                                        <span style="color: #3b82f6; font-weight: bold;">2.</span>
                                        <span style="color: #64748b; margin-left: 12px;">Arrive at the airport 2 hours before departure</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 0;">
                                        <span style="color: #3b82f6; font-weight: bold;">3.</span>
                                        <span style="color: #64748b; margin-left: 12px;">Present your booking reference at check-in</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 24px 30px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
                            <div style="font-size: 24px; font-weight: bold; color: #3b82f6; margin-bottom: 8px;">✈️ Bookoro</div>
                            <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                                Thank you for choosing Bookoro. Have a wonderful trip!
                            </p>
                            <p style="margin: 16px 0 0 0; color: #cbd5e1; font-size: 11px;">
                                © 2024 Bookoro. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        `;

        await this.transporter.sendMail({
            from: '"Bookoro" <noreply@bookoro.com>',
            to: email,
            subject: '✅ Booking Confirmed - Bookoro',
            html,
        });
        console.log(`[MailService] ✅ Confirmation email sent to ${email}`);
    }
}
