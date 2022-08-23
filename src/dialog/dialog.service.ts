import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { DialogModel } from './dialog.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { CreateDialogDto } from './dto/create-dialog.dto';

@Injectable()
export class DialogService {
	constructor(@InjectModel(DialogModel) private readonly dialogModel: ModelType<DialogModel>) {
	}

	async create(dto: CreateDialogDto) {
		return await this.dialogModel.create({ ...dto });
	}

	async getAllUserDialogs(id: Types.ObjectId) {
		return this.dialogModel.find({
			$or: [
				{ 'author': id },
				{ 'mate': id }
			]
		}).populate('author mate lastMessage');
	}

	async getById(id: string) {
		return this.dialogModel.findById(new Types.ObjectId(id)).populate('author mate').exec();
	}

	async getByUser(userId, mateId) {
		return this.dialogModel.findOne({
			$or: [{ 'mate': mateId, author: userId }, {
				'mate': userId,
				'author': mateId
			}]
		}).exec();
	}

	async updateLastMessage(id: string, lastMessage: string) {
		return this.dialogModel.findByIdAndUpdate(new Types.ObjectId(id), {
			lastMessage: new Types.ObjectId(lastMessage)
		}, { new: true }).populate('author mate lastMessage').exec();
	}
}

