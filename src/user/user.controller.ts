import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserEmail } from '../decorators/email.decorarator';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {
	}

	@Get()
	async getAllUsers() {
		return this.userService.getAllUsers();
	}

	@UseGuards(JwtAuthGuard)
	@Get('getById/:id')
	async getUserById(@Param('id', IdValidationPipe) id: string, @UserEmail() email: string) {
		console.log(email);
		return this.userService.getUserById(id);
	}
}
