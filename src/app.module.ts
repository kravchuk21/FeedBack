import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import { AuthModule } from './auth/auth.module';
import { getMongoConfig } from './configs/mongo.config';
import { UserModule } from './user/user.module';
import { MessageModule } from './message/message.module';
import { DialogModule } from './dialog/dialog.module';
import { MailModule } from './mail/mail.module';

@Module({
	imports: [
		AuthModule,
		ConfigModule.forRoot(),
		TypegooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getMongoConfig
		}),
		UserModule,
		MessageModule,
		DialogModule,
		MailModule
	]
})
export class AppModule {
}
