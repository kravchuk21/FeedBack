import { prop } from '@typegoose/typegoose';
import { TimeStamps, Base } from '@typegoose/typegoose/lib/defaultClasses';
import { Types } from 'mongoose';

export interface MessageModel extends Base { }
export class MessageModel extends TimeStamps {
	@prop()
	authorId: Types.ObjectId;

	@prop()
	text: string;

	@prop()
	dialogId: Types.ObjectId;
}
