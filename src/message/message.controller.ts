import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	UnauthorizedException,
	UseGuards
} from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageService } from './message.service';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { CAN_NOT_DELETE_MESSAGE, MESSAGE_NOT_FOUND_ERROR, UNABLE_TO_RECEIVE_MESSAGES } from './message.constants';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { FindMessagesDto } from './dto/find-messages.dto';
import { UserEmail } from '../decorators/email.decorarator';
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
	@Post()
	async create(@Body() dto: CreateMessageDto) {
		return this.messageService.create(dto);
	}

	@UseGuards(JwtAuthGuard)
	@Get()
	async findAllDialogMessages(@Body() dto: FindMessagesDto, @UserEmail() email: string) {
		const user = await this.userService.getUserByEmail(email);

		if (!user) {
			throw new BadRequestException(USER_NOT_FOUND_ERROR);
		}

		const dialog = await this.dialogService.getById(dto.dialogId);

		if (!dialog) {
			throw new BadRequestException(DIALOG_NOT_FOUND_ERROR);
		}

		const userID = user._id.toString();
		const dialogAuthor = dialog.author.toString();
		const dialogMate = dialog.mate.toString();

		if (userID == dialogAuthor || userID == dialogMate) {
			return await this.messageService.findAllDialogMessages(dto.dialogId);
		}

		throw new UnauthorizedException(UNABLE_TO_RECEIVE_MESSAGES);

	}

	@UseGuards(JwtAuthGuard)
	@Get('getById/:id')
	async findById(@Param('id', IdValidationPipe) id: string) {
		return this.messageService.findById(id);
	}

	@UseGuards(JwtAuthGuard)
	@Delete('deleteById/:id')
	async deleteById(@Param('id', IdValidationPipe) id: string, @UserEmail() email: string) {
		const user = await this.userService.getUserByEmail(email);
		const message = await this.messageService.findById(id);

		if (!message) {
			throw new BadRequestException(MESSAGE_NOT_FOUND_ERROR);
		}


		if (String(message.authorId) !== String(user._id)) {
			throw  new UnauthorizedException(CAN_NOT_DELETE_MESSAGE);
		}

		return this.messageService.deleteById(id);
	}

	@UseGuards(JwtAuthGuard)
	@Patch('updateById/:id')
	async updateById(@Param('id', IdValidationPipe) id: string, @Body() dto: CreateMessageDto, @UserEmail() email: string) {
		const user = await this.userService.getUserByEmail(email);
		const message = await this.messageService.findById(id);

		if (!message) {
			throw new BadRequestException(MESSAGE_NOT_FOUND_ERROR);
		}


		if (String(message.authorId) !== String(user._id)) {
			throw  new UnauthorizedException(CAN_NOT_DELETE_MESSAGE);
		}

		return this.messageService.updateById(id, dto);
	}
}
