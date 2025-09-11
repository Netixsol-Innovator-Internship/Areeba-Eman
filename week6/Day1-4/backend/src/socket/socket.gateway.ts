import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
@WebSocketGateway({
  cors: {
    origin: ['https://week6-frontend.vercel.app'], //  frontend URL
    methods: ['GET', 'POST'],
  },
  namespace: '/'
})
export class SocketGateway {
  @WebSocketServer() server: Server;
  handleConnection(client: Socket) {
    const userId = client.handshake.auth?.userId || client.handshake.query?.userId;
    const roles = (client.handshake.auth?.roles || '').toString().split(',');
    if (userId) client.join(`user:${userId}`);
    if (roles?.includes('admin') || roles?.includes('superadmin')) client.join('admins');
  }
  notifyUser(userId: string, event: string, payload: any) { this.server.to(`user:${userId}`).emit(event, payload); }
  notifyAdmins(event: string, payload: any) { this.server.to('admins').emit(event, payload); }
  @SubscribeMessage('ping') ping(@MessageBody() data: any, @ConnectedSocket() client: Socket) { client.emit('pong', data || 'pong'); }
}
