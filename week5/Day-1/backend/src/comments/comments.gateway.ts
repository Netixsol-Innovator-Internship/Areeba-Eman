import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CommentsService } from './comments.service';
import { AuthService } from '../auth/auth.service';

@WebSocketGateway(3000, {
  cors: { origin: '*'},
})
export class CommentsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  // username -> socketId (last seen)
  private userToSocket = new Map<string, string>();
  private socketToUser = new Map<string, string>();

  constructor(
    private readonly comments: CommentsService,
    private readonly auth: AuthService,
  ) {}

  handleConnection(client: Socket) {
    // Ask client to identify; meanwhile still send all comments
    client.emit('all_comments', this.comments.getAll());
  }

  handleDisconnect(client: Socket) {
    const user = this.socketToUser.get(client.id);
    if (user) {
      this.userToSocket.delete(user);
      this.socketToUser.delete(client.id);
      this.emitUsersOnline();
    }
  }

  private emitUsersOnline() {
    this.server.emit('users_online', Array.from(this.userToSocket.keys()));
  }

  /** Client should call after connect: identify with username */
  @SubscribeMessage('identify')
  identify(client: Socket, username: string) {
    if (!username) return;
    this.userToSocket.set(username, client.id);
    this.socketToUser.set(client.id, username);
    client.join(`user:${username}`); // room for DMs
    this.emitUsersOnline();
  }

  /** Add new comment (public or DM) */
  @SubscribeMessage('add_comment')
  addComment(client: Socket, @MessageBody() body: { user: string; text: string; to?: string | null }) {
    const creator = client.id;
    const payload = this.comments.create(body.user, body.text, body.to ?? null, creator);

    if (payload.to) {
      // DM: send only to recipient and author
      const recipientRoom = `user:${payload.to}`;
      client.to(recipientRoom).emit('new_comment', payload);
      client.emit('new_comment', payload);
    } else {
      // Public message
      this.server.emit('new_comment', payload);
    }
  }

  /** Delete comment (only author socket can) */
  @SubscribeMessage('delete_comment')
  deleteComment(client: Socket, id: number) {
    const res = this.comments.delete(Number(id), client.id);
    if (res.ok) {
      // broadcast deletion
      this.server.emit('delete_comment', Number(id));
    } else {
      // optionally notify client of failure
      client.emit('delete_failed', { id, reason: 'not-owner-or-missing' });
    }
  }

  /** Direct Message */
  @SubscribeMessage('dm')
  dm(client: Socket, body: { to: string; text: string }) {
    const from = this.socketToUser.get(client.id) || 'unknown';
    const room = `user:${body.to}`;
    const dmPayload = { from, to: body.to, text: body.text };
    client.to(room).emit('dm', dmPayload);
    client.emit('dm', dmPayload); // echo back to sender
  }
}
