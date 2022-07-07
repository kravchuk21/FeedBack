import { IsString } from 'class-validator';

export class FindMessagesDto {
	@IsString()
	dialogId: string;
}
