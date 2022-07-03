import { IsString } from 'class-validator';
import { AuthLoginDto } from './auth-login.dto';

export class AuthRegisterDto extends AuthLoginDto {
	@IsString()
	fullName: string;
}
