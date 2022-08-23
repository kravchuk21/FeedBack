import { IsString, MinLength } from 'class-validator';

export class CreateMessageDto {
	@IsString()
	author: string;

	@IsString()
	mate: string;

	@IsString()
	@MinLength(1)
	text: string;

	@IsString()
	dialogId: string;
}
