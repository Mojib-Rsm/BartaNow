
'use server';

import nodemailer from 'nodemailer';

interface SendMailOptions {
    to: string;
    subject: string;
    html: string;
}

// Check if SMTP is configured
const isSmtpConfigured = process.env.SMTP_HOST && 
                         process.env.SMTP_PORT && 
                         process.env.SMTP_USERNAME && 
                         process.env.SMTP_PASSWORD;

// Create a transporter object only if configured
const transporter = isSmtpConfigured ? nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_PORT === '465', // true for port 465, false for others
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
    },
}) : null;

export async function sendMail({ to, subject, html }: SendMailOptions) {
    if (!transporter) {
        console.log("SMTP not configured. Skipping email send.");
        // In a real app, you might want to handle this more gracefully
        // For this demo, we just log and pretend it was sent.
        return;
    }

    const mailOptions = {
        from: `"BartaNow Notifier" <${process.env.SMTP_USERNAME}>`,
        to: to,
        subject: subject,
        html: html,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
        // Re-throw the error so the caller can handle it if needed
        throw new Error('Failed to send email.');
    }
}
