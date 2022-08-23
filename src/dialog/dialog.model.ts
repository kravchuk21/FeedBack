import { prop, Ref } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { UserModel } from '../user/user.model';
import { MessageModel } from '../message/message.model';

export interface DialogModel extends Base {
}

export class DialogModel extends TimeStamps {
	@prop({ ref: () => UserModel })
	author: Ref<UserModel>;

	@prop({ ref: () => UserModel })
	mate: Ref<UserModel>;

	@prop({ ref: () => MessageModel })
	lastMessage?: Ref<MessageModel>;
}
