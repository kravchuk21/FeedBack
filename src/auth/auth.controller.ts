import { Body, Controller, Post } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {
	}

	@Post('register')
	async register(@Body() dto: AuthDto) {
		return this.authService.register(dto);
	}

	@Post('login')
	async login(@Body() dto: Omit<AuthDto, 'fullName'>) {
		return this.authService.login(dto);
	}
}
