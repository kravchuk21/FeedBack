import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class AuthLoginDto {
	@ApiProperty({
		description: 'User Email',
		example: 'test@gmail.com'
	})
	@IsEmail({}, { message: 'Введите корректный E-mail' })
	email: string;

	@ApiProperty({
		description: 'User password',
		example: '123456',
		maxLength: 12,
		minLength: 6
	})
	@IsString()
	@MaxLength(12, { message: 'Пароль не может быть длиннее 12 символов' })
	@MinLength(6, { message: 'Пароль должен быть не короче 6 символов' })
	password: string;
}
