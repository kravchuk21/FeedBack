import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Types } from 'mongoose';

export interface DialogModel extends Base {
}

export class DialogModel extends TimeStamps {
	@prop()
	author: Types.ObjectId;

	@prop()
	mate: Types.ObjectId;

	@prop()
	lastMessage?: Types.ObjectId;
}
