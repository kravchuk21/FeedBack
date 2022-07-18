import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { UserService } from '../user/user.service';
import {
	EMAIL_IS_ALREADY_VERIFIED,
	USER_NOT_FOUND_ERROR,
	WRONG_PASSWORD_ERROR,
	WRONG_VERIFICATION_CODE_ERROR
} from './auth.constants';
import { UserModel } from 'src/user/user.model';
import { compare, genSalt, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly mailService: MailService,
		private readonly jwtService: JwtService) {
	}

	async register(dto: AuthRegisterDto) {
		const salt = await genSalt(10);
		const verificationCode = AuthService.generateVerifyCode();

		await this.mailService.sendUserConfirmation(dto.email, verificationCode);

		const newUserDto = {
			fullName: dto.fullName,
			email: dto.email,
			password: await hash(dto.password, salt),
			verificationCode: await AuthService.hashVerifyCode(verificationCode)
		};

		return this.userService.createUser(newUserDto);
	}

	async validateUser(email: string, password: string): Promise<Pick<UserModel, 'email'>> {
		const user = await this.userService.getUserByEmail(email);
		if (!user) {
			throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
		}

		const isCorrectPassword = await compare(password, user.password);
		if (!isCorrectPassword) {
			throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
		}

		return { email: user.email };
	}

	async login(email: string) {
		const payload = { email };
		const user = await this.userService.getUserByEmail(email);
		const { verify } = user;
		return {
			verify,
			email,
			access_token: await this.jwtService.signAsync(payload)
		};
	}

	async verify(verificationCode: string, email: string) {
		const user = await this.userService.getUserByEmail(email);
		if (!user) {
			throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
		}

		if (user.verify) {
			throw new BadRequestException(EMAIL_IS_ALREADY_VERIFIED);
		}

		const isCorrectVerificationCode = await compare(verificationCode, user.verificationCode);
		if (!isCorrectVerificationCode) {
			throw new UnauthorizedException(WRONG_VERIFICATION_CODE_ERROR);
		}

		return this.userService.updateUserVerify(email, '', true);
	}

	async getNewVerificationCode(email: string) {
		const verificationCode = AuthService.generateVerifyCode();
		await this.mailService.sendUserConfirmation(email, verificationCode);
		return this.userService.updateUserVerify(email, await AuthService.hashVerifyCode(verificationCode));
	}

	private static generateVerifyCode(): string {
		return Math.floor(1000 + Math.random() * 9000).toString();
	}

	private static async hashVerifyCode(code: string): Promise<string> {
		const salt = await genSalt(9);
		return await hash(code, salt);
	}
}
