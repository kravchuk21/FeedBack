import { Injectable } from '@nestjs/common';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';

@Injectable()
export class AuthService {
	async register(dto: AuthRegisterDto) {
		console.log(dto);
	}

	async login(dto: AuthLoginDto) {
		console.log(dto);
	}
}
