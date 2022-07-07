import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export interface UserModel extends Base {
}

export class UserModel extends TimeStamps {
	@prop()
	fullName: string;

	@prop()
	avatar?: string;

	@prop({ unique: true })
	email: string;

	@prop()
	password: string;
}
