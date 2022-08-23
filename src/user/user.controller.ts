import { BadRequestException, Controller, Delete, Get, Param, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { USER_CAN_NOT_BE_DELETED, USER_NOT_FOUND_ERROR } from '../auth/auth.constants';
import { UserId } from '../decorators/id.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {
	}

	@UseGuards(JwtAuthGuard)
	@Get()
	async getAllUsers() {
		return this.userService.getAllUsers();
	}

	@UseGuards(JwtAuthGuard)
	@Get('getById/:id')
	async getUserById(@Param('id', IdValidationPipe) id: string) {
		const user = await this.userService.getUserById(id);

		if (!user) {
			throw new BadRequestException(USER_NOT_FOUND_ERROR);
		}

		return user;
	}

	@UseGuards(JwtAuthGuard)
	@Get('me')
	async getProfile(@UserId() id: string) {
		const user = await this.userService.getUserById(id);

		if (!user) {
			throw new BadRequestException(USER_NOT_FOUND_ERROR);
		}

		return user;
	}

	@Get('search/:text')
	searchUser(@Param('text') text: string) {
		return this.userService.findUser(text);
	}

	@Delete('/deleteById/:id')
	@UseGuards(JwtAuthGuard)
	async deleteUser(@Param('id') deletedId: string, @UserId() id: string) {
		if (deletedId !== id) {
			throw new UnauthorizedException(USER_CAN_NOT_BE_DELETED);
		}

		const user = await this.userService.getUserById(deletedId);

		if (!user) {
			throw new BadRequestException(USER_NOT_FOUND_ERROR);
		}

		return this.userService.deleteUser(deletedId);
	}
}
