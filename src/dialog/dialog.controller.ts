import { BadRequestException, Controller, Get, UseGuards } from '@nestjs/common';
import { DialogService } from './dialog.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserEmail } from '../decorators/email.decorarator';
import { UserService } from '../user/user.service';
import { USER_NOT_FOUND_ERROR } from '../auth/auth.constants';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Dialog')
@Controller('dialog')
export class DialogController {
	constructor(private readonly dialogService: DialogService,
							private readonly userService: UserService) {
	}


	@ApiResponse({
		status: 200,
		description: 'All user dialogs',
		schema: {
			example: [
				{
					'_id': '62c6ea7b62ae97005c3b29df',
					'author': [
						{
							'_id': '62c6c32b08e4b66261307319',
							'fullName': 'Vladislav',
							'email': 'krauchukvlad@gmail.com',
							'password': '$2a$10$35g5LjG5ov8ox0ngMJ9YmO4KjG.NBFzELMudiRymMZ2zxLwxaWF/W',
							'createdAt': '2022-07-07T11:27:39.517Z',
							'updatedAt': '2022-07-07T11:27:39.517Z',
							'__v': 0
						}
					],
					'mate': [
						{
							'_id': '62c6c32b08e4b66261307319',
							'fullName': 'Vladislav',
							'email': 'krauchukvlad@gmail.com',
							'password': '$2a$10$35g5LjG5ov8ox0ngMJ9YmO4KjG.NBFzELMudiRymMZ2zxLwxaWF/W',
							'createdAt': '2022-07-07T11:27:39.517Z',
							'updatedAt': '2022-07-07T11:27:39.517Z',
							'__v': 0
						}
					],
					'createdAt': '2022-07-07T14:15:23.569Z',
					'updatedAt': '2022-07-07T14:15:23.569Z',
					'__v': 0,
					'lastMessage': []
				}
			]
		}
	})
	@ApiResponse({
		status: 401,
		description: 'User unauthorized',
		schema: {
			example: {
				'statusCode': 401,
				'message': 'Unauthorized'
			}
		}
	})
	@UseGuards(JwtAuthGuard)
	@Get()
	async getAllUserDialogs(@UserEmail() email: string) {
		const user = await this.userService.getUserByEmail(email);

		if (!user) {
			throw new BadRequestException(USER_NOT_FOUND_ERROR);
		}

		return this.dialogService.getAllUserDialogs(user._id);
	}

}
