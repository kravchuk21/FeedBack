import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { DialogService } from '../dialog/dialog.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { BadRequestException } from '@nestjs/common';
import { DIALOG_NOT_FOUND_ERROR } from '../dialog/dialog.constants';
import { MessageService } from './message.service';

@WebSocketGateway({ cors: ['*'] })
export class MessageGateway {
	constructor(private readonly messageService: MessageService,
							private readonly dialogService: DialogService) {
	}

	@WebSocketServer()
	server;

	@SubscribeMessage('MESSAGE:CREATE')
	async createMessage(@MessageBody() dto: CreateMessageDto) {
		const dialog = await this.dialogService.getById(dto.dialogId);

		if (!dialog) {
			throw new BadRequestException(DIALOG_NOT_FOUND_ERROR);
		}

		const newMessage = await this.messageService.create(dto);

		await this.dialogService.updateLastMessage(dialog._id, newMessage._id);
		this.server.emit('MESSAGE:CREATED', newMessage);
	}
}
