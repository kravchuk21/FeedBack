import { Injectable } from '@nestjs/common';
import { CreateDialogDto } from './dto/create-dialog.dto';
import { InjectModel } from 'nestjs-typegoose';
import { DialogModel } from './dialog.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';

@Injectable()
export class DialogService {
	constructor(@InjectModel(DialogModel) private readonly dialogModel: ModelType<DialogModel>) {
	}

	async create(dto: CreateDialogDto) {
		const newDialog = new this.dialogModel({ ...dto });
		await newDialog.save();
		return this.dialogModel.aggregate([
			{
				$match: {
					_id: newDialog._id
				}
			},
			{
				$lookup: {
					from: 'User',
					localField: 'author',
					foreignField: '_id',
					as: 'author'
				}
			},
			{
				$lookup: {
					from: 'User',
					localField: 'mate',
					foreignField: '_id',
					as: 'mate'
				}
			},
			{
				$lookup: {
					from: 'Message',
					localField: 'lastMessage',
					foreignField: '_id',
					as: 'lastMessage'
				}
			}
		]);
	}

	async getAllUserDialogs(id: Types.ObjectId) {
		return this.dialogModel.aggregate([
			{
				$match: {
					$or: [
						{ author: id, },
						{ mate: id }
					]
				}
			},

			{
				$lookup: {
					from: 'User',
					localField: 'author',
					foreignField: '_id',
					as: 'author'
				}
			},
			{
				$lookup: {
					from: 'User',
					localField: 'mate',
					foreignField: '_id',
					as: 'mate'
				}
			},
			{
				$lookup: {
					from: 'Message',
					localField: 'lastMessage',
					foreignField: '_id',
					as: 'lastMessage'
				}
			}
		]);
	}

	async getById(id: string) {
		return this.dialogModel.findById(new Types.ObjectId(id));
	}

	async updateLastMessage(id: Types.ObjectId, lastMessage: Types.ObjectId) {
		return this.dialogModel.findByIdAndUpdate(id, {
			lastMessage
		});
	}
}

