import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';


@Injectable()
export class MailerService {
    private async transporter() {
        const testAccount = await nodemailer.createTestAccount()
        const transporter = nodemailer.createTransport({
            host: 'localhost',
            port: 1025,
            ignoreTLS: true,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });  
        return transporter;
    }
    async sendConfirmationEmail(userEmail: string) {
        ((await this.transporter()).sendMail({
            from: 'test@example.com',
            to: userEmail,
            subject: 'inscription confirmée',
            html: '<h1>inscription confirmée</h1>',
        }))
    }

    async sendResetPasswordEmail(userEmail: string, url: string, code: string) {
        ((await this.transporter()).sendMail({
            from: 'app@example.com',
            to: userEmail,
            subject: 'Reset Password',
            html: `<h1>Reset Password</h1>
            <p>Click on the link below to reset your password</p>
            <a href="${url}">Reset Password</a>
            <strong>Code: ${code}</strong>
            <p>Code will expire in 15 minutes</p>`,
        }))
    }
}
