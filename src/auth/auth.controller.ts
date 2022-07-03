import { BadRequestException, Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthService } from './auth.service';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { UserService } from '../user/user.service';
import { ALREADY_REGISTERED_ERROR } from './auth.constants';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService,
							private readonly userService: UserService) {
	}

	@Post('register')
	async register(@Body() dto: AuthRegisterDto) {
		const oldUser = await this.userService.getUserByEmail(dto.email);
		if (oldUser) {
			throw new BadRequestException(ALREADY_REGISTERED_ERROR);
		}
		return this.authService.register(dto);
	}

	@HttpCode(200)
	@Post('login')
	async login(@Body() { email, password }: AuthLoginDto) {
		const { email: validatedEmail } = await this.authService.validateUser(email, password);
		return this.authService.login(validatedEmail);
	}
}
