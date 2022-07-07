import { BadRequestException, Body, Controller, Get, Param, UnauthorizedException, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { UNABLE_TO_RECEIVE_MESSAGES } from './message.constants';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { FindMessagesDto } from './dto/find-messages.dto';
import { UserEmail } from '../decorators/email.decorarator';
import { UserService } from '../user/user.service';
import { DialogService } from '../dialog/dialog.service';
import { USER_NOT_FOUND_ERROR } from '../auth/auth.constants';
import { DIALOG_NOT_FOUND_ERROR } from '../dialog/dialog.constants';
import { ApiBearerAuth, ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Message')
@Controller('message')
export class MessageController {
	constructor(
		private readonly messageService: MessageService,
		private readonly userService: UserService,
		private readonly dialogService: DialogService) {
	}

	@ApiBody({ type: FindMessagesDto })
	@ApiResponse({
		status: 200,
		description: 'All dialog messages',
		schema: {
			example: []
		}
	})
	@ApiResponse({
		status: 400,
		description: 'Message error',
		schema: {
			example: {
				'statusCode': 400,
				'message': 'Диалог с таким id не найден',
				'error': 'Bad Request'
			}
		}
	})
	@ApiResponse({
		status: 401,
		description: 'Message error',
		schema: {
			example: {
				'statusCode': 401,
				'message': 'Невозмодно получить сообщения',
				'error': 'Unauthorized'
			}
		}
	})
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

	@ApiParam({ name: 'id' })
	@ApiResponse({
		status: 200,
		description: 'Dialog message',
		schema: {
			example: {
				_id: '62c6eed0a4a0fe47aea44f07',
				dialogId: '62c6eaa36f06c07004e5cf73',
				createdAt: '2022-07-07T14:33:52.079Z',
				updatedAt: '2022-07-07T14:33:52.079Z',
				__v: 0
			}
		}
	})
	@ApiResponse({
		status: 400,
		description: 'Message error',
		schema: {
			example: {
				'statusCode': 400,
				'message': 'Сообщение с таким id не найден',
				'error': 'Bad Request'
			}
		}
	})
	@ApiResponse({
		status: 401,
		description: 'Message error',
		schema: {
			example: {
				'statusCode': 401,
				'message': 'Невозмодно получить сообщения',
				'error': 'Unauthorized'
			}
		}
	})
	@UseGuards(JwtAuthGuard)
	@Get('getById/:id')
	async findById(@Param('id', IdValidationPipe) id: string) {
		return this.messageService.findById(id);
	}
}
