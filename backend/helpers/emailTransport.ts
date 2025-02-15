import 'dotenv/config';
import nodemailer, { Transporter } from 'nodemailer';
import mg from 'nodemailer-mailgun-transport';

let transporter: Transporter | null = null;

if (process.env.NODE_ENV === 'development') {
    transporter = nodemailer.createTransport({
        host: '127.0.0.1',
        port: 1025,
        secure: false,
        tls: {
            rejectUnauthorized: false,
        },
    });
} else if (process.env.NODE_ENV === 'production') {
    transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: 587,
        secure: false,
        auth: {
            user: process.env.SMTP_NAME,
            pass: process.env.SMTP_PASS,
        },
        debug: true,
    });
}

export default transporter;
