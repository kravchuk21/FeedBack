import { IsEmail, IsString } from 'class-validator';

export class VerifyDto {
	@IsString()
	verificationCode: string;

	@IsEmail()
	email: string;
}
