import { env } from '../env';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: 'lucaslevingston94@gmail.com',
    pass: env.NODEMAILER_PASS,
  },
});

export async function sendMail(to: string, resetUrl: string) {
  return await transporter.sendMail({
    to,
    subject: 'Gym Evolution: Password Recover',
    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
             Please click on the following link, or paste this into your browser to complete the process:\n\n
             ${resetUrl}\n\n
             If you did not request this, please ignore this email and your password will remain unchanged.\n`,
  });
}
