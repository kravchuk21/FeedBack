import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { UserService } from '../user/user.service';
import { USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from './auth.constants';
import { UserModel } from 'src/user/user.model';
import { compare, genSalt, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(private readonly userService: UserService,
							private readonly jwtService: JwtService) {
	}

	async register(dto: AuthRegisterDto) {
		const salt = await genSalt(10);
		const newUserDto = {
			fullName: dto.fullName,
			email: dto.email,
			passwordHash: await hash(dto.password, salt)
		};
		return this.userService.createUser(newUserDto);
	}

	async validateUser(email: string, password: string): Promise<Pick<UserModel, 'email'>> {
		const user = await this.userService.getUserByEmail(email);
		if (!user) {
			throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
		}
		const isCorrectPassword = await compare(password, user.passwordHash);
		if (!isCorrectPassword) {
			throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
		}
		return { email: user.email };
	}

	async login(email: string) {
		const payload = { email };
		return {
			access_token: await this.jwtService.signAsync(payload)
		};
	}
}
