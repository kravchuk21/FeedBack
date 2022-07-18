import { BadRequestException, Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthService } from './auth.service';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { UserService } from '../user/user.service';
import { ALREADY_REGISTERED_ERROR } from './auth.constants';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VerifyDto } from './dto/verify.dto';
import { Cron } from '@nestjs/schedule';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService,
							private readonly userService: UserService) {
	}


	@ApiBody({ type: AuthRegisterDto })
	@ApiResponse({ status: 201, description: 'User has been successfully created.' })
	@ApiResponse({
		status: 400,
		description: 'User has not been created.',
		schema: {
			example: {
				'statusCode': 400,
				'message': 'Text of error',
				'error': 'Bad Request'
			}
		}
	})
	@Post('register')
	async register(@Body() dto: AuthRegisterDto) {
		const user = await this.userService.getUserByEmail(dto.email);
		if (user) {
			throw new BadRequestException(ALREADY_REGISTERED_ERROR);
		}
		return this.authService.register(dto);
	}

	@ApiBody({ type: AuthLoginDto })
	@ApiResponse({
		status: 200, description: 'User has been successfully login.', schema: {
			example: {
				'access_token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImtyYXVjaHVrdmxhZEBnbWFpbC5jb20iLCJpYXQiOjE2NTcxOTQzMTR9.2BRLzTZXLJXR1CZmw-pQUzLOGuEx9cAWvqEVJ-iqnvI'
			}
		}
	})
	@ApiResponse({
		status: 401,
		description: 'User has not been login.',
		schema: {
			example: {
				'statusCode': 401,
				'message': 'Text of error',
				'error': 'Unauthorized'
			}
		}
	})
	@HttpCode(200)
	@Post('login')
	async login(@Body() { email, password }: AuthLoginDto) {
		const { email: validatedEmail } = await this.authService.validateUser(email, password);
		return this.authService.login(validatedEmail);
	}

	@ApiBody({ type: VerifyDto })
	@ApiResponse({
		status: 200, description: 'User was success verified'
	})
	@ApiResponse({
		status: 400,
		description: 'User already was verified.',
		schema: {
			example: {
				'statusCode': 400,
				'message': 'Почта уже подтверждена',
				'error': 'Bad Request'
			}
		}
	})
	@HttpCode(200)
	@Post('verify')
	async verify(@Body() dto: VerifyDto) {
		return this.authService.verify(dto.verificationCode, dto.email);
	}

	@ApiResponse({
		status: 200, description: 'Success sand verification code to user email'
	})
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
