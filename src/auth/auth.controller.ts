import { BadRequestException, Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthService } from './auth.service';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { UserService } from '../user/user.service';
import { ALREADY_REGISTERED_ERROR } from './auth.constants';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

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
		const oldUser = await this.userService.getUserByEmail(dto.email);
		if (oldUser) {
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
}
