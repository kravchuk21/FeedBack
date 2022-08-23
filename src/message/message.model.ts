import { prop, Ref } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Types } from 'mongoose';
import { UserModel } from '../user/user.model';

export interface MessageModel extends Base {
}

export class MessageModel extends TimeStamps {
	@prop({ ref: () => UserModel })
	author: Ref<UserModel>;

	@prop()
	text: string;

	@prop()
	dialogId: Types.ObjectId;
}
