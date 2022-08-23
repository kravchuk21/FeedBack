import { IsString } from 'class-validator';

export class CreateDialogDto {
	@IsString()
	author: string;

	@IsString()
	mate: string;
}
