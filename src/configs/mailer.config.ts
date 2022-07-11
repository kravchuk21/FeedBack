import { ConfigService } from '@nestjs/config';
import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

export const getMailConfig = async (configService: ConfigService, templatePath: string): Promise<MailerOptions> => {
	return {
		transport: getMailTransport(configService),
		defaults: {
			from: `"No Reply" <${configService.get('MAIL_FROM')}>`
		},
		template: getMailTemplate(templatePath)
	};
};

const getMailTemplate = (dir: string) => ({
	dir,
	adapter: new HandlebarsAdapter(),
	options: {
		strict: true
	}
});

const getMailTransport = (configService) => ({
	host: configService.get('MAIL_HOST'),
	secure: false,
	port: configService.get('MAIL_PORT'),
	auth: {
		user: configService.get('MAIL_USER'),
		pass: configService.get('MAIL_PASSWORD')
	}
});
