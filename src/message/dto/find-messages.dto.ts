import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindMessagesDto {
	@ApiProperty({
		description: 'Message dialog ID',
		example: '62c2b009d4205cfe656e3c8e'
	})
	@IsString()
	dialogId: string;
}
