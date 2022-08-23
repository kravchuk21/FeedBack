import { IsString, MinLength } from 'class-validator';
import { AuthLoginDto } from './auth-login.dto';

export class AuthRegisterDto extends AuthLoginDto {
	@IsString()
	@MinLength(4)
	fullName: string;
}
