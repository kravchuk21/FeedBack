import { BadRequestException, Controller, Get, Param, UseGuards } from '@nestjs/common';
import { DialogService } from './dialog.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserEmail } from '../decorators/email.decorator';
import { UserService } from '../user/user.service';
import { USER_NOT_FOUND_ERROR } from '../auth/auth.constants';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { DIALOG_NOT_FOUND_ERROR } from './dialog.constants';
import { UserId } from '../decorators/id.decorator';

@Controller('dialog')
export class DialogController {
	constructor(private readonly dialogService: DialogService,
							private readonly userService: UserService) {
	}

	@UseGuards(JwtAuthGuard)
	@Get()
	async getAllUserDialogs(@UserEmail() email: string) {
		const user = await this.userService.getUserByEmail(email);

		if (!user) {
			throw new BadRequestException(USER_NOT_FOUND_ERROR);
		}

		return await this.dialogService.getAllUserDialogs(user._id);
	}

	@UseGuards(JwtAuthGuard)
	@Get('/getMate/:dialogId')
	async getDialogMate(@Param('dialogId', IdValidationPipe) dialogId: string, @UserId('id', IdValidationPipe) id: string) {
		const dialog = await this.dialogService.getById(dialogId);

		if (!dialog) {
			throw new BadRequestException(DIALOG_NOT_FOUND_ERROR);
		}

		return id.toString() === dialog.author._id.toString() ? dialog.mate : dialog.author;
	}

	@UseGuards(JwtAuthGuard)
	@Get('/getByUser/:userId')
	async findDialogByUser(@UserId('id', IdValidationPipe) id: string, @Param('userId', IdValidationPipe) userId: string) {
		const dialog = await this.dialogService.getByUser(userId, id);

		if (!dialog) {
			throw new BadRequestException(DIALOG_NOT_FOUND_ERROR);
		}

		return dialog._id
	}
}
