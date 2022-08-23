import { BadRequestException, Controller, Get, Param, UnauthorizedException, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { UNABLE_TO_RECEIVE_MESSAGES } from './message.constants';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserEmail } from '../decorators/email.decorator';
import { UserService } from '../user/user.service';
import { DialogService } from '../dialog/dialog.service';
import { USER_NOT_FOUND_ERROR } from '../auth/auth.constants';
import { DIALOG_NOT_FOUND_ERROR } from '../dialog/dialog.constants';

@Controller('message')
export class MessageController {
	constructor(
		private readonly messageService: MessageService,
		private readonly userService: UserService,
		private readonly dialogService: DialogService) {
	}

	@UseGuards(JwtAuthGuard)
	@Get(':dialogId')
	async findAllDialogMessages(@Param('dialogId', IdValidationPipe) dialogId: string, @UserEmail() email: string) {
		const user = await this.userService.getUserByEmail(email);

		if (!user) {
			throw new BadRequestException(USER_NOT_FOUND_ERROR);
		}

		const dialog = await this.dialogService.getById(dialogId);


		if (!dialog) {
			throw new BadRequestException(DIALOG_NOT_FOUND_ERROR);
		}

		const userID = user._id.toString();

		if (dialog.author._id.toString() == userID || dialog.mate._id.toString() == userID) {
			return await this.messageService.findAllDialogMessages(dialogId);
		}

		throw new UnauthorizedException(UNABLE_TO_RECEIVE_MESSAGES);
	}

	@UseGuards(JwtAuthGuard)
	@Get('getById/:id')
	async findById(@Param('id', IdValidationPipe) id: string) {
		return this.messageService.findById(id);
	}
}
