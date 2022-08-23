import { Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { UserModel } from './user.model';
import { AuthRegisterDto } from '../auth/dto/auth-register.dto';

@Injectable()
export class UserService {
	constructor(@InjectModel(UserModel) private readonly userModel: ModelType<UserModel>) {
	}

	async getAllUsers(): Promise<UserModel[]> {
		return await this.userModel.find().exec();
	}

	async getUserById(id: string, populate?: string): Promise<UserModel> | null {
		return await this.userModel.findById(id).populate(populate).exec();
	}

	async getUserByEmail(email: string, populate?: string): Promise<UserModel> | null {
		return await this.userModel.findOne({ email }).populate(populate).exec();
	}

	async findUser(text: string) {
		return this.userModel.find({ $text: { $search: text } });
	}

	async createUser(dto: AuthRegisterDto) {
		return await this.userModel.create(dto);
	}

	async updateUserVerify(email: string, verificationCode: string, verify = false) {
		return this.userModel.findOneAndUpdate({ email }, { verify, verificationCode });
	}

	async deleteUser(id: string) {
		return this.userModel.findByIdAndDelete(id);
	}
}
