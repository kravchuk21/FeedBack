import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';
import { UserModel } from 'src/user/user.model';
import { EMAIL_IS_NOT_VERIFIED } from '../auth.constants';

@Injectable()
export class WsJwtStrategy extends PassportStrategy(Strategy, 'wsjwt') {
	constructor(private readonly configService: ConfigService,
							private readonly userService: UserService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: configService.get('JWT_SECRET')
		});
	}


	async validate(payload: UserModel) {
		const { email } = payload;
		const user = await this.userService.getUserByEmail(email);

		if (!user) {
			throw new UnauthorizedException();
		}

		if (!user.verify) {
			throw new UnauthorizedException(EMAIL_IS_NOT_VERIFIED);
		}

		return {
			id: user.id,
			email: user.email
		};
	}
}
