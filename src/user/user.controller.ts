import { BadRequestException, Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { USER_NOT_FOUND_ERROR } from '../auth/auth.constants';
import { UserId } from '../decorators/id.decorator';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {
	}

	@ApiResponse({
		status: 200,
		description: 'All users',
		schema: {
			example: [
				{
					'_id': '62c6c32b08e4b66261307319',
					'fullName': 'Elon Mask',
					'email': 'test@gmail.com',
					'password': '$2a$10$35g5LjG5ov8ox0ngMJ9YmO4KjG.NBFzELMudiRymMZ2zxLwxaWF/W',
					'createdAt': '2022-07-07T11:27:39.517Z',
					'updatedAt': '2022-07-07T11:27:39.517Z',
					'__v': 0
				}
			]
		}
	})
	@ApiResponse({
		status: 401,
		description: 'User unauthorized.',
		schema: {
			example: {
				'statusCode': 401,
				'message': 'Unauthorized'
			}
		}
	})
	@UseGuards(JwtAuthGuard)
	@Get()
	async getAllUsers() {
		return this.userService.getAllUsers();
	}

	@ApiParam({ name: 'id' })
	@ApiResponse({
		status: 200,
		description: 'Founded user.',
		schema: {
			example: [
				{
					'_id': '62c6c32b08e4b66261307319',
					'fullName': 'Elon Mask',
					'email': 'test@gmail.com',
					'password': '$2a$10$35g5LjG5ov8ox0ngMJ9YmO4KjG.NBFzELMudiRymMZ2zxLwxaWF/W',
					'createdAt': '2022-07-07T11:27:39.517Z',
					'updatedAt': '2022-07-07T11:27:39.517Z',
					'__v': 0
				}
			]
		}
	})
	@ApiResponse({
		status: 400,
		description: 'User not found',
		schema: {
			example: {
				'statusCode': 400,
				'message': 'Пользователь с таким email не найден',
				'error': 'Bad Request'
			}
		}
	})
	@UseGuards(JwtAuthGuard)
	@Get('getById/:id')
	async getUserById(@Param('id', IdValidationPipe) id: string) {
		const user = await this.userService.getUserById(id);

		if (!user) {
			throw new BadRequestException(USER_NOT_FOUND_ERROR);
		}

		return user;
	}

	@ApiResponse({
		status: 200,
		description: 'Founded user.',
		schema: {
			example: [
				{
					'_id': '62c6c32b08e4b66261307319',
					'fullName': 'Elon Mask',
					'email': 'test@gmail.com',
					'password': '$2a$10$35g5LjG5ov8ox0ngMJ9YmO4KjG.NBFzELMudiRymMZ2zxLwxaWF/W',
					'createdAt': '2022-07-07T11:27:39.517Z',
					'updatedAt': '2022-07-07T11:27:39.517Z',
					'__v': 0
				}
			]
		}
	})
	@ApiResponse({
		status: 400,
		description: 'User email not verified',
		schema: {
			example: {
				'statusCode': 401,
				'message': 'Почта не подтверждена',
				'error': 'Unauthorized'
			}
		}
	})
	@UseGuards(JwtAuthGuard)
	@Get('me')
	async getProfile(@UserId() id: string) {
		const user = await this.userService.getUserById(id);

		if (!user) {
			throw new BadRequestException(USER_NOT_FOUND_ERROR);
		}

		const { password, verificationCode, ...userData } = user;

		return userData
	}

	@Get('search/:text')
	searchUser(@Param('text') text: string) {
		return this.userService.findUser(text);
	}
}
