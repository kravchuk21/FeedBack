import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { CreateDialogDto } from './dto/create-dialog.dto';
import { UserEmail } from '../decorators/email.decorarator';
import { UserService } from '../user/user.service';
import { BadRequestException } from '@nestjs/common';
import { USER_NOT_FOUND_ERROR } from '../auth/auth.constants';
import { DialogService } from './dialog.service';

@WebSocketGateway({ cors: ['*'] })
export class DialogGateway {
	constructor(private readonly userService: UserService,
							private readonly dialogService: DialogService) {
	}

	@WebSocketServer()
	server;

	@SubscribeMessage('DIALOG:CREATE')
	async createDialog(@MessageBody() dto: Pick<CreateDialogDto, 'mate'>, @UserEmail() email: string) {
		const mate = await this.userService.getUserById(dto.mate);

		if (!mate) {
			throw new BadRequestException(USER_NOT_FOUND_ERROR);
		}

		const author = await this.userService.getUserByEmail(email);

		if (!author) {
			throw new BadRequestException(USER_NOT_FOUND_ERROR);
		}

		const newDialog = await this.dialogService.create({
			author: String(author._id),
			mate: dto.mate
		});

		console.log(newDialog);

		this.server.emit('DIALOG:CREATED', newDialog);
	}
}
