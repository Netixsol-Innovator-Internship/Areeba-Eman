import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  async sendMail(to: string, subject: string, html: string) {
    if (process.env.NODE_ENV !== 'production') this.logger.log(`sendMail to=${to} subject=${subject}`);
    try {
      const info = await this.transporter.sendMail({ from: process.env.MAIL_FROM || 'no-reply@example.com', to, subject, html });
      this.logger.log(`Mail sent: ${info.messageId}`);
    } catch (e) {
      this.logger.error('Email send failed, falling back to log. ' + (e.message || e));
      this.logger.debug(`MAIL FALLBACK to=${to} subject=${subject} body=${html}`);
    }
  }
  async sendOtpEmail(to: string, code: string) {
    const html = `<div style="font-family:sans-serif"><h2>Your verification code</h2><p>Use this OTP within ${process.env.OTP_EXPIRY_MINUTES || 7} minutes:</p><div style="font-size:28px;font-weight:bold;letter-spacing:4px">${code}</div></div>`;
    await this.sendMail(to, 'Verify your email', html);
  }
  async sendResetEmail(to: string, code: string) {
    const html = `<div style="font-family:sans-serif"><h2>Password reset code</h2><p>Use this OTP within ${process.env.OTP_EXPIRY_MINUTES || 7} minutes to reset your password:</p><div style="font-size:28px;font-weight:bold;letter-spacing:4px">${code}</div></div>`;
    await this.sendMail(to, 'Reset your password', html);
  }
}
