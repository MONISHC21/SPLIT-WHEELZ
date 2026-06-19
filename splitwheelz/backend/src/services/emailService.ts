import sgMail from '@sendgrid/mail';
import { logger } from '../config/logger';

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@splitwheelz.com';
const FROM_NAME = 'SplitWheelz';

interface BookingData {
  id: string;
  startTime: Date;
  endTime: Date;
  totalAmount: { toString(): string };
  vehicle?: { make?: string; model?: string; registrationNumber?: string };
}

export async function sendBookingConfirmationEmail(
  to: string,
  name: string,
  booking: BookingData
): Promise<void> {
  const msg = {
    to,
    from: { email: FROM_EMAIL, name: FROM_NAME },
    subject: `Booking Confirmed - ${booking.vehicle?.make || ''} ${booking.vehicle?.model || ''}`,
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Inter, sans-serif; background: #F8FAFC; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <div style="background: linear-gradient(135deg, #0F172A 0%, #2563EB 100%); padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">SplitWheelz</h1>
            <p style="color: #93C5FD; margin: 8px 0 0;">Vehicle Co-Ownership Platform</p>
          </div>
          <div style="padding: 32px;">
            <h2 style="color: #0F172A; margin-bottom: 8px;">Booking Created! 🚗</h2>
            <p style="color: #64748B; margin-bottom: 24px;">Hi ${name}, your booking has been created. Complete payment to confirm.</p>
            <div style="background: #F8FAFC; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
              <h3 style="color: #0F172A; margin: 0 0 16px;">Booking Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; color: #64748B;">Booking ID</td><td style="padding: 8px 0; color: #0F172A; font-weight: 600; text-align: right;">#${booking.id.slice(-8).toUpperCase()}</td></tr>
                <tr><td style="padding: 8px 0; color: #64748B;">Vehicle</td><td style="padding: 8px 0; color: #0F172A; font-weight: 600; text-align: right;">${booking.vehicle?.make || ''} ${booking.vehicle?.model || ''}</td></tr>
                <tr><td style="padding: 8px 0; color: #64748B;">Start</td><td style="padding: 8px 0; color: #0F172A; font-weight: 600; text-align: right;">${new Date(booking.startTime).toLocaleString('en-IN')}</td></tr>
                <tr><td style="padding: 8px 0; color: #64748B;">End</td><td style="padding: 8px 0; color: #0F172A; font-weight: 600; text-align: right;">${new Date(booking.endTime).toLocaleString('en-IN')}</td></tr>
                <tr style="border-top: 1px solid #E2E8F0;"><td style="padding: 12px 0; color: #0F172A; font-weight: 700;">Total Amount</td><td style="padding: 12px 0; color: #2563EB; font-weight: 700; text-align: right; font-size: 18px;">₹${Number(booking.totalAmount).toFixed(2)}</td></tr>
              </table>
            </div>
            <a href="${process.env.FRONTEND_URL}/bookings/${booking.id}" style="display: block; background: linear-gradient(135deg, #2563EB, #38BDF8); color: white; text-decoration: none; padding: 16px; border-radius: 12px; text-align: center; font-weight: 600; font-size: 16px;">Complete Payment</a>
          </div>
          <div style="background: #F8FAFC; padding: 24px; text-align: center; border-top: 1px solid #E2E8F0;">
            <p style="color: #94A3B8; margin: 0; font-size: 14px;">© 2024 SplitWheelz. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await sgMail.send(msg);
    logger.info(`Booking confirmation email sent to ${to}`);
  } catch (error) {
    logger.error('Failed to send booking confirmation email:', error);
  }
}

export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
  const msg = {
    to,
    from: { email: FROM_EMAIL, name: FROM_NAME },
    subject: 'Welcome to SplitWheelz! 🚗',
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Inter, sans-serif; background: #F8FAFC; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #0F172A, #2563EB); padding: 40px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 32px;">Welcome to SplitWheelz!</h1>
          </div>
          <div style="padding: 32px;">
            <h2>Hi ${name}! 👋</h2>
            <p>You've joined the future of vehicle ownership. Here's what you can do:</p>
            <ul style="line-height: 2;">
              <li>🚗 Browse and co-own vehicles with up to 3 others</li>
              <li>📅 Book your vehicle's time slots with ease</li>
              <li>💰 Split costs automatically</li>
              <li>📊 Track your usage and savings</li>
            </ul>
            <a href="${process.env.FRONTEND_URL}/marketplace" style="display: block; background: #2563EB; color: white; text-decoration: none; padding: 16px; border-radius: 12px; text-align: center; font-weight: 600; margin-top: 24px;">Explore Vehicles</a>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    logger.error('Failed to send welcome email:', error);
  }
}

export async function sendPaymentFailedEmail(to: string, name: string, amount: number): Promise<void> {
  const msg = {
    to,
    from: { email: FROM_EMAIL, name: FROM_NAME },
    subject: 'Payment Failed - SplitWheelz',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <h2>Payment Failed ❌</h2>
        <p>Hi ${name}, your payment of ₹${amount.toFixed(2)} could not be processed.</p>
        <p>Please try again or contact support.</p>
        <a href="${process.env.FRONTEND_URL}/payments" style="background: #2563EB; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">Retry Payment</a>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    logger.error('Failed to send payment failed email:', error);
  }
}
