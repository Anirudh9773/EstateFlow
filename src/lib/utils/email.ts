import fs from 'fs'
import path from 'path'
import nodemailer from 'nodemailer'

/**
 * Utility to send emails. In development mode, if no API key or SMTP config is provided,
 * it will log the email content to the console for testing.
 * If SMTP_USER and SMTP_PASS are defined, it will send a real email using Gmail SMTP (does not require custom domain).
 * If RESEND_API_KEY is defined, it will send a real email using Resend's REST API.
 */
export async function sendEmail({
  to,
  subject,
  html,
  code,
}: {
  to: string;
  subject: string;
  html: string;
  code?: string;
}): Promise<{ success: boolean; error?: string }> {
  // Always log to the server console for easy debugging/copying of the OTP
  console.log(`\n==================================================`);
  console.log(`📧 EMAIL DISPATCH`);
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  
  if (code) {
    console.log(`🔑 Verification Code: ${code}`);
    try {
      const otpFile = 'd:\\Anirudh\'s Project\\estateflow\\scratch\\last_otp.txt'
      const dir = path.dirname(otpFile)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
      fs.writeFileSync(otpFile, code)
      console.log(`💾 Saved OTP code to: ${otpFile}`)
    } catch (e) {
      console.error('Failed to write last_otp.txt:', e)
    }
  } else {
    // Fallback: extract 6-digit OTP code if present
    const codeMatch = html.match(/\b\d{6}\b/);
    if (codeMatch) {
      console.log(`🔑 Verification Code: ${codeMatch[0]}`);
    }
  }
  
  console.log(`==================================================\n`);

  // 1. Check if Gmail SMTP credentials are provided
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: `"EstateFlow" <${smtpUser}>`,
        to,
        subject,
        html,
      });

      console.log('✅ Real email sent successfully via Gmail SMTP');
      return { success: true };
    } catch (e) {
      console.error('❌ Exception occurred during Gmail SMTP call:', e);
      const message = e instanceof Error ? e.message : 'Gmail SMTP error';
      return { success: false, error: message };
    }
  }

  // 2. Fallback to Resend API key if set (for backward compatibility)
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: 'EstateFlow <onboarding@resend.dev>',
          to,
          subject,
          html,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error('❌ Failed to send email via Resend API:', errData);
        return { success: false, error: errData.message || 'Resend API error' };
      } else {
        console.log('✅ Real email sent successfully via Resend API');
        return { success: true };
      }
    } catch (e) {
      console.error('❌ Exception occurred during Resend API call:', e);
      const message = e instanceof Error ? e.message : 'Resend Exception';
      return { success: false, error: message };
    }
  }

  console.log('💡 Note: Set SMTP_USER/SMTP_PASS or RESEND_API_KEY in .env.local to send real emails.');
  return { success: true };
}
