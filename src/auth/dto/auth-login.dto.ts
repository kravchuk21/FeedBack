import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class AuthLoginDto {
	@IsEmail()
	email: string;

	@IsString()
	@MaxLength(12)
	@MinLength(6)
	password: string;
}
