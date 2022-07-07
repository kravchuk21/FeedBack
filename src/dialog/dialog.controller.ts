import { BadRequestException, Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateDialogDto } from './dto/create-dialog.dto';
import { DialogService } from './dialog.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserEmail } from '../decorators/email.decorarator';
import { UserService } from '../user/user.service';
import { USER_NOT_FOUND_ERROR } from '../auth/auth.constants';

@Controller('dialog')
export class DialogController {
	constructor(private readonly dialogService: DialogService,
							private readonly userService: UserService) {
	}

	@UseGuards(JwtAuthGuard)
	@Post()
	async create(@Body() dto: CreateDialogDto) {
		return this.dialogService.create(dto);
	}

	@UseGuards(JwtAuthGuard)
	@Get()
	async getAllUserDialogs(@UserEmail() email: string) {
		const user = await this.userService.getUserByEmail(email)

		if(!user) {
			throw new BadRequestException(USER_NOT_FOUND_ERROR);
		}

		return this.dialogService.getAllUserDialogs(user._id);
	}

}
