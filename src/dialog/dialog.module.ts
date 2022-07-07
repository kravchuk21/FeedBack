import { Module } from '@nestjs/common';
import { DialogController } from './dialog.controller';
import { DialogService } from './dialog.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { DialogModel } from './dialog.model';
import { DialogGateway } from './dialog.gateway';
import { UserModule } from '../user/user.module';

@Module({
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: DialogModel,
				schemaOptions: {
					collection: 'Dialog'
				}
			}
		]),
		UserModule
	],
	controllers: [DialogController],
	providers: [DialogService, DialogGateway],
	exports: [DialogService]
})
export class DialogModule {
}
