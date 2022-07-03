import { Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
	async register(dto: AuthDto) {
		console.log(dto);
	}

	async login(dto: Omit<AuthDto, 'fullName'>) {
		console.log(dto);
	}
}
