import { BadRequestException, Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthService } from './auth.service';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { UserService } from '../user/user.service';
import { ALREADY_REGISTERED_ERROR } from './auth.constants';
import { VerifyDto } from './dto/verify.dto';
import { Cron } from '@nestjs/schedule';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService,
							private readonly userService: UserService) {
	}

	@Post('register')
	async register(@Body() dto: AuthRegisterDto) {
		const user = await this.userService.getUserByEmail(dto.email);

		if (user) {
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

	@HttpCode(200)
	@Post('verify')
	async verify(@Body() dto: VerifyDto) {
		return this.authService.verify(dto.verificationCode, dto.email);
	}

	@HttpCode(200)
	@Post('getNewVerificationCode')
	async getNewVerificationCode(@Body() dto: Pick<VerifyDto, 'email'>) {
		return this.authService.getNewVerificationCode(dto.email);
	}

	// Delete all not verified users at 1am every day if createdAt > 1 day
	@Cron('0 0 1 * * *')
	async deleteNotVerifiedUsers() {
		const users = await this.userService.getAllUsers();

		const getTheDifferenceInDays = (date_1: Date, date_2: Date): number => {
			let difference = date_1.getTime() - date_2.getTime();
			return Math.abs(Math.ceil(difference / (1000 * 3600 * 24)));
		};

		users.forEach(user => {
			if (!user.verify && getTheDifferenceInDays(new Date(user.createdAt), new Date()) > 1) {
				this.userService.deleteUser(user.id);
			}
		});
	}
}
