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
		return this.userModel.findById(id).exec();
	}

	async getUserByEmail(email: string): Promise<UserModel> | null {
		return this.userModel.findOne({ email }).exec();
	}

	async createUser(dto: AuthRegisterDto) {
		await this.userModel.create(dto);
	}

	async updateUserVerify(email: string, verificationCode: string) {
		await this.userModel.findOneAndUpdate({ email }, { verify: false, verificationCode });
	}

}
