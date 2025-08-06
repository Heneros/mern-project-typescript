import 'dotenv/config';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

import transporter from '../helpers/emailTransport';
// import transporter from '../helpers/emailTransport';

import { systemLogs } from './Logger';

export const sendEmail = async (
    email: string,
    subject: string,
    payload: object,
    templateName: string,
) => {
    try {
        const templatePath = path.join(__dirname, templateName);

        if (!fs.existsSync(templatePath)) {
            throw new Error(`Template file not found: ${templatePath}`);
        }

        const source = fs.readFileSync(templatePath, 'utf8');
        const compiled = handlebars.compile(source);

        if (!transporter) {
            systemLogs.error('Email transporter is not initialized');
            throw new Error('Email transporter is not initialized');
        }
        await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: email,
            subject,
            html: compiled(payload),
        });
    } catch (err) {
        systemLogs.error(`email not sent: ${err}`);
        throw err;
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
        // let transporter;
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
