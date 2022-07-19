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
		return this.userModel.find().exec();
	}

	async getUserById(id: string): Promise<UserModel> | null {
		return (await this.userModel.findById(id).exec()).toObject();
	}

	async getUserByEmail(email: string): Promise<UserModel> | null {
		return (await this.userModel.findOne({ email }).exec()).toObject();
	}

	async findUser(text: string) {
		return this.userModel.find({ $text: { $search: text, $caseSensitive: false }}).exec();
	}

	async createUser(dto: AuthRegisterDto) {
		await this.userModel.create(dto);
	}

	async updateUserVerify(email: string, verificationCode: string, verify = false) {
		await this.userModel.findOneAndUpdate({ email }, { verify, verificationCode });
	}

	async deleteUser(id: string) {
		await this.userModel.findByIdAndDelete(id);
	}

}
