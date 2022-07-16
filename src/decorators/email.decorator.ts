import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserModel } from '../user/user.model';

export const UserEmail = createParamDecorator(
	(data: unknown, ctx: ExecutionContext): UserModel => {
		const request = ctx.switchToHttp().getRequest();
		return request.user.email;
	}
);
