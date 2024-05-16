import { AppLogger } from "@/common/service";
import { MailerService } from "@nestjs-modules/mailer";
import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";

@Processor('auth')
export class AuthProcessor {
    constructor(
        private readonly mailerService: MailerService,
        private readonly logger: AppLogger
    ) { }

    @Process('send-user-mail-verification')
    async handleUserMailVerification(job: Job) {
        this.logger.log(`Start handling email verification for ${job.data.email}`);

        await this.mailerService.sendMail({
            to: job.data.email,
            from: `Welcome to BookReader <${process.env.GMAIL_USER}>`,
            subject: 'Verify your email',
            text: '',
            template: 'email-verification',
            context: {
                name: job.data.username,
                activationLink: `${process.env.APP_URL}/auth/verify/${job.data.verificationToken}`,
            }
        });
        this.logger.log(`Verification email sent to ${job.data.email}`);
    }
}