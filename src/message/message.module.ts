import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { MessageModel } from './message.model';
import { UserModule } from '../user/user.module';
import { DialogModule } from '../dialog/dialog.module';
import { MessageGateway } from './message.gateway';

@Module({
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: MessageModel,
				schemaOptions: {
					collection: 'Message'
				}
			}
		]),
		UserModule,
		DialogModule
	],
	controllers: [MessageController],
	providers: [MessageService, MessageGateway],
	exports: [MessageService]
})
export class MessageModule {
}
