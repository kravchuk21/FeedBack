import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyDto {
	@ApiProperty({
		description: 'Verification code',
		example: '1111'
	})
	@IsString()
	verificationCode: string;

	@ApiProperty({
		description: 'User Email',
		example: 'test@gmail.com'
	})
	@IsEmail()
	email: string;
}
