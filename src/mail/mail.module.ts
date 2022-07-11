import { MailerModule } from '@nestjs-modules/mailer';
import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getMailConfig } from '../configs/mailer.config';
import { join } from 'path';

@Global()
@Module({
	imports: [
		MailerModule.forRootAsync({
			useFactory: async (config: ConfigService) => {
				console.log(12);
				return getMailConfig(config, join(__dirname, 'templates'))
			},
			inject: [ConfigService],
			imports: [ConfigModule]
		})
	],
	providers: [MailService],
	exports: [MailService]
})
export class MailModule {
}
