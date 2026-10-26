import nodemailer from 'nodemailer';

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  const { GMAIL_USER, GMAIL_APP_PASSWORD } = process.env;
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) return null;

  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: GMAIL_USER.trim(),
      // Google shows app passwords with spaces ("abcd efgh ijkl mnop") - strip them
      pass: GMAIL_APP_PASSWORD.replace(/\s+/g, ''),
    },
  });
  return transporter;
}

/**
 * Sends the OTP email via Gmail SMTP.
 * - Gmail not configured  -> logs OTP to console, returns { delivered: false }
 * - Gmail configured but sending fails -> logs the real reason and returns
 *   { delivered: false, error } so you can see WHY in the server console.
 */
export async function sendOtpEmail(toEmail, otp) {
  const t = getTransporter();

  if (!t) {
    console.log(`[DEV] GMAIL_USER / GMAIL_APP_PASSWORD not set. OTP for ${toEmail} is: ${otp}`);
    return { delivered: false };
  }

  try {
    const info = await t.sendMail({
      from: `"JOB+" <${process.env.GMAIL_USER.trim()}>`,
      to: toEmail,
      subject: `${otp} is your JOB+ verification code`,
      text: `Your JOB+ verification code is ${otp}. It expires in 10 minutes.`,
      html: `
        <div style="font-family:sans-serif;max-width:420px;margin:auto">
          <h2 style="color:#FF6B35">JOB+</h2>
          <p>Your verification code is:</p>
          <p style="font-size:32px;font-weight:800;letter-spacing:6px">${otp}</p>
          <p style="color:#666">This code expires in 10 minutes. If you didn't request this, you can ignore this email.</p>
        </div>
      `,
    });
    console.log(`[MAIL] OTP email sent to ${toEmail} (id ${info.messageId})`);
    return { delivered: true };
  } catch (err) {
    const u = (process.env.GMAIL_USER || '').trim();
    const pw = (process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '');
    console.error(`[MAIL] Failed to send OTP to ${toEmail}: ${err.message}`);
    console.error(`[MAIL] Sender account used : "${u}"`);
    console.error(`[MAIL] App password loaded : ${pw.length} chars (should be exactly 16), starts with "${pw.slice(0, 2)}", looks like placeholder: ${pw === 'abcdefghijklmnop' || u === 'yourname@gmail.com'}`);
    return { delivered: false, error: err.message };
  }
}