import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class AuthLoginDto {
	@IsEmail({}, { message: 'Введите корректный E-mail' })
	email: string;

	@IsString()
	@MaxLength(12, { message: 'Пароль не может быть длиннее 12 символов' })
	@MinLength(6, { message: 'Пароль должен быть не короче 6 символов' })
	password: string;
}
