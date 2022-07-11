import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
	constructor(private mailerService: MailerService) {
	}

	async sendUserConfirmation(email, code: string) {
		await this.mailerService.sendMail({
			to: email,
			subject: 'Welcome to FeedBack! Confirm your Email',
			template: './confirmation',
			context: {
				email,
				code
			}
		});
	}
}
