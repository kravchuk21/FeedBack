import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDialogDto {
	@ApiProperty({
		description: 'Dialog author ID',
		example: '62c2b009d4205cfe656e3c8e'
	})
	@IsString()
	author: string;

	@ApiProperty({
		description: 'Dialog mate ID',
		example: '62c2b009d4205cfe656e3c8e'
	})
	@IsString()
	mate: string;
}
