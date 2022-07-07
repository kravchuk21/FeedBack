import { IsString, MinLength } from 'class-validator';
import { AuthLoginDto } from './auth-login.dto';
import { ApiProperty } from '@nestjs/swagger';

export class AuthRegisterDto extends AuthLoginDto {
	@ApiProperty({
		description: 'User full name',
		example: 'Elon Mask',
		minLength: 4
	})
	@IsString()
	@MinLength(4)
	fullName: string;
}
