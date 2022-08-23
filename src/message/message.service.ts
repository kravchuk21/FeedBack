import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageModel } from './message.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';

@Injectable()
export class MessageService {
	constructor(@InjectModel(MessageModel) private readonly messageModel: ModelType<MessageModel>) {
	}

	async create(dto: CreateMessageDto) {
		return (await this.messageModel.create(dto)).populate('author');
	}

	async findById(id: string) {
		return this.messageModel.findById(id).exec();
	}

	async findAllDialogMessages(dialogId: string) {
		return this.messageModel.find({ dialogId }).populate('author').exec();
	}

	async deleteById(id: string) {
		return this.messageModel.findByIdAndDelete(id).exec();
	}

	async updateById(id: string, dto: CreateMessageDto) {
		return this.messageModel.findByIdAndUpdate(id, dto, { new: true }).exec();
	}
}
