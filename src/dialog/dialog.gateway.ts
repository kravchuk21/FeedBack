import { SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { WsAuthGuard } from 'src/auth/guards/wsjwt.guard';
import { Socket } from 'socket.io';


@WebSocketGateway({ cors: ['*'] })
@UseGuards(WsAuthGuard)
export class DialogGateway {
	@WebSocketServer()
	server;

	@SubscribeMessage('JOIN')
	join(socket: Socket, userId: string): WsResponse<unknown> {
		socket.join(userId);
		return { event: 'join', data: userId };
	}
}
