import 'dotenv/config';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

import transporter from '@/helpers/emailTransport';
// import transporter from '../helpers/emailTransport';

import { systemLogs } from './Logger';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

export const sendEmail = async (
    email: string,
    subject: string,
    payload: object,
    template: string,
) => {
    try {
        const templatePath = path.join(process.cwd(), template);
        const sourceDirectory = fs.readFileSync(templatePath, 'utf8');

        const compiledTemplate = handlebars.compile(sourceDirectory);

        const emailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject,
            html: compiledTemplate(payload),
        };
        if (!transporter) {
            systemLogs.error(
                'Email transporter is not initialized. Check your configuration.',
            );
            throw new Error(
                'Email transporter is not initialized. Check your configuration.',
            );
        }

        await transporter.sendMail(emailOptions);
    } catch (error) {
        systemLogs.error(`email not sent: ${error}`);
    }
};

export const receiverEmailFunction = async (
    from: string,
    to: string,
    subject: string,
    payload: object,
    template: string,
) => {
    try {
        const sourceDirectory = fs.readFileSync(
            path.join(__dirname, template),
            'utf8',
        );
        const compiledTemplate = handlebars.compile(sourceDirectory);

        const emailOptions = {
            from,
            to: process.env.SENDER_EMAIL,
            subject,
            payload,
            html: compiledTemplate(payload),
        };
        if (!transporter) {
            systemLogs.error(
                'Email transporter is not initialized. Check your configuration.',
            );
            throw new Error(
                'Email transporter is not initialized. Check your configuration.',
            );
        }

        await transporter.sendMail(emailOptions);
    } catch (error) {
        console.log(error);
        systemLogs.error(`email not sent: ${error}`);
    }
};
