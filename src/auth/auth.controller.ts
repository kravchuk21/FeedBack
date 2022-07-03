import { Body, Controller, Post } from '@nestjs/common';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthService } from './auth.service';
import { AuthRegisterDto } from './dto/auth-register.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {
	}

	@Post('register')
	async register(@Body() dto: AuthRegisterDto) {
		return this.authService.register(dto);
	}

	@Post('login')
	async login(@Body() dto: AuthLoginDto) {
		return this.authService.login(dto);
	}
}
