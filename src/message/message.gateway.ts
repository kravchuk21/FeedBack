import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { DialogService } from '../dialog/dialog.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { WsAuthGuard } from '../auth/guards/wsjwt.guard';
import { Socket } from 'socket.io';

@WebSocketGateway({ cors: ['*'] })
@UseGuards(WsAuthGuard)
export class MessageGateway {
	constructor(private readonly messageService: MessageService,
							private readonly dialogService: DialogService) {
	}

	@WebSocketServer()
	server;

	@SubscribeMessage('MESSAGE:CREATE')
	async createMessage(client: Socket,
											dto: Omit<CreateMessageDto, 'author'>) {

		const authorId = (client?.handshake as any).user.id;

		let dialog = await this.dialogService.getById(dto.dialogId);

		if (!dialog) {
			dialog = await this.dialogService.create({ author: authorId, mate: dto.mate });
		}

		const newMessage =
			await this.messageService.create({ ...dto, dialogId: dialog._id.toString(), author: authorId });

		const updatedDialog =
			await this.dialogService.updateLastMessage(dialog._id.toString(), newMessage._id.toString());

		this.server.to(authorId).to(dto.mate).emit('DIALOG:UPDATED', updatedDialog);
		this.server.to(authorId).to(dto.mate).emit('MESSAGE:CREATED', newMessage);
	}
}
