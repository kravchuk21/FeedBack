import { index, prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export interface UserModel extends Base {
}

@index({email: 'text', fullname: 'text'})
export class UserModel extends TimeStamps {
	@prop()
	fullName: string;

	@prop()
	avatar?: string;

	@prop({ unique: true })
	email: string;

	@prop({select: false})
	password: string;

	@prop({ default: false })
	verify: boolean;

	@prop({select: false})
	verificationCode: string;
}
