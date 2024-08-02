import 'dotenv/config';
import nodemailer from 'nodemailer';
import mg from 'nodemailer-mailgun-transport';

let transporter;

if (process.env.NODE_ENV === 'development') {
    transporter = nodemailer.createTransport({
        //  host: 'mailhog',
        host: '127.0.0.1',
        port: 1025,
    });
} else if (process.env.NODE_ENV === 'production') {
    const mailgunAuth = {
        auth: {
            api_key: process.env.MAILGUN_API_KEY,
            domain: process.env.MAILGUN_DOMAIN,
        },
    };
    // console.log('prod mail', 21);
    transporter = nodemailer.createTransport(mg(mailgunAuth));
}

export default transporter;
