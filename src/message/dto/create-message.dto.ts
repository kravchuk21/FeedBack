import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
	@ApiProperty({
		description: 'Message author ID',
		example: '62c2b009d4205cfe656e3c8e'
	})
	@IsString()
	authorId: string;

	@ApiProperty({
		description: 'Message text',
		example: 'Hello world',
		minLength: 1
	})
	@IsString()
	@MinLength(1)
	text: string;

	@ApiProperty({
		description: 'Message dialog ID',
		example: '62c2b009d4205cfe656e3c8e'
	})
	@IsString()
	dialogId: string;
}
