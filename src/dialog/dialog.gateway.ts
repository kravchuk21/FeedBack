import { SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { CreateDialogDto } from './dto/create-dialog.dto';
import { UserService } from '../user/user.service';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { USER_NOT_FOUND_ERROR } from '../auth/auth.constants';
import { DialogService } from './dialog.service';
import { WsAuthGuard } from 'src/auth/guards/wsjwt.guard';
import { Socket } from 'socket.io';


@WebSocketGateway({ cors: ['*'] })
@UseGuards(WsAuthGuard)
export class DialogGateway {
	constructor(private readonly userService: UserService,
							private readonly dialogService: DialogService) {
	}

	@WebSocketServer()
	server;

	@SubscribeMessage('DIALOG:CREATE')
	async createDialog(
		client: Socket,
		dto: Pick<CreateDialogDto, 'mate'>
	) {
		const authorId = (client?.handshake as any).user.id;


		try {
			const mate = await this.userService.getUserById(dto.mate);

			if (!mate) {
				throw new BadRequestException(USER_NOT_FOUND_ERROR);
			}


			const author = await this.userService.getUserById(authorId);

			if (!author) {
				throw new BadRequestException(USER_NOT_FOUND_ERROR);
			}

			const newDialog = await this.dialogService.create({
				author: String(author._id),
				mate: dto.mate
			});

			return this.server.emit('DIALOG:CREATED', newDialog);
		} catch (error) {
			throw new WsException(error?.message);
		}
	}
}
