import nodemailer from 'nodemailer';
import { env } from './env.js';

let cachedTransporter;

const createTransporter = () => {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  const transportOptions = env.smtp.service
    ? {
        service: env.smtp.service,
        auth: {
          user: env.smtp.user,
          pass: env.smtp.pass
        }
      }
    : {
        host: env.smtp.host,
        port: env.smtp.port,
        secure: env.smtp.secure,
        auth: {
          user: env.smtp.user,
          pass: env.smtp.pass
        }
      };

  cachedTransporter = nodemailer.createTransport(transportOptions);
  return cachedTransporter;
};

export const sendPasswordResetOtpEmail = async ({ email, name, otp }) => {
  if (!env.smtp.user || !env.smtp.pass) {
    if (!env.isProduction) {
      console.warn(
        `SMTP is not configured. Password reset OTP for ${email}: ${otp}`
      );
      return;
    }

    throw new Error('SMTP email credentials are not configured.');
  }

  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"${env.smtp.fromName}" <${env.smtp.fromEmail}>`,
    to: email,
    subject: 'Your NEW OPTION TECHNOLOGY password reset code',
    text: [
      `Hello ${name || 'there'},`,
      '',
      `Your password reset OTP is ${otp}.`,
      `It expires in ${env.passwordResetOtpExpiresMinutes} minutes.`,
      '',
      'If you did not request this code, you can safely ignore this email.'
    ].join('\n'),
    html: `
      <div style="font-family: Arial, sans-serif; background: #0f1115; padding: 32px; color: #f8fafc;">
        <div style="max-width: 560px; margin: 0 auto; background: #161a23; border: 1px solid #334155; border-radius: 18px; padding: 32px;">
          <p style="margin: 0 0 12px; color: #facc15; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase;">Password reset</p>
          <h1 style="margin: 0 0 16px; font-size: 28px; color: #ffffff;">Your verification code</h1>
          <p style="margin: 0 0 20px; color: #cbd5e1; line-height: 1.6;">
            Hello ${name || 'there'}, use the one-time code below to continue resetting your password.
          </p>
          <div style="margin: 0 0 20px; padding: 18px 20px; border-radius: 14px; background: #020617; border: 1px solid #475569; text-align: center;">
            <span style="font-size: 32px; font-weight: 700; letter-spacing: 0.28em; color: #f8fafc;">${otp}</span>
          </div>
          <p style="margin: 0 0 10px; color: #cbd5e1; line-height: 1.6;">
            This OTP expires in <strong>${env.passwordResetOtpExpiresMinutes} minutes</strong> and can only be used once.
          </p>
          <p style="margin: 0; color: #94a3b8; line-height: 1.6;">
            If you did not request this reset, no action is needed.
          </p>
        </div>
      </div>
    `
  });
};
