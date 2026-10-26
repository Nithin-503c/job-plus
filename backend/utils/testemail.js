// Run:  node test-email.js you@gmail.com
import dotenv from 'dotenv';
import { sendOtpEmail } from './utils/sendEmail.js';
dotenv.config();
const to = process.argv[2] || process.env.GMAIL_USER;
const res = await sendOtpEmail(to, '123456');
console.log(res.delivered ? `Sent! Check the inbox of ${to}` : `Not delivered: ${res.error || 'credentials missing in .env'}`);