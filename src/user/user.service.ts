import { Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { UserModel } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
	constructor(@InjectModel(UserModel) private readonly userModel: ModelType<UserModel>) {
	}

	async getAllUsers(): Promise<UserModel[]> {
		return this.userModel.find().exec();
	}

	async getUserById(id: string): Promise<UserModel> | null {
		return this.userModel.findById(id).exec();
	}

	async getUserByEmail(email: string): Promise<UserModel> | null {
		return this.userModel.findOne({ email }).exec();
	}

	async createUser(dto: CreateUserDto) {
		await this.userModel.create(dto);
	}

}
