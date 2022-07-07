import { IsString } from 'class-validator';

export class CreateMessageDto {

	@IsString()
	authorId: string;

	@IsString()
	text: string;

	@IsString()
	dialogId: string;
}
