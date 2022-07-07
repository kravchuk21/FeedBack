import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageModel } from './message.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { Types } from 'mongoose';

@Injectable()
export class MessageService {
	constructor(@InjectModel(MessageModel) private readonly messageModel: ModelType<MessageModel>) {
	}

	async create(dto: CreateMessageDto) {
		return this.messageModel.create(dto);
	}

	async findById(id: string) {
		return this.messageModel.findById(id).exec();
	}

	async findAllDialogMessages(dialogId: string) {
		return this.messageModel.aggregate([
			{
				$match: {
					dialogId: new Types.ObjectId(dialogId)
				}
			},
			{
				$lookup: {
					from: 'User',
					localField: 'authorId',
					foreignField: '_id',
					as: 'user'
				}
			}
		]).exec();
	}

	async deleteById(id: string) {
		return this.messageModel.findByIdAndDelete(id).exec();
	}

	async updateById(id: string, dto: CreateMessageDto) {
		return this.messageModel.findByIdAndUpdate(id, dto, { new: true }).exec();
	}
}
