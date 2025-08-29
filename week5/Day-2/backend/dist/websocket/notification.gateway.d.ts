import { type OnGatewayConnection, type OnGatewayDisconnect } from "@nestjs/websockets";
import type { Server, Socket } from "socket.io";
import { JwtService } from "@nestjs/jwt";
import { NotificationService } from "../notification/notification.service";
interface AuthenticatedSocket extends Socket {
    userId?: string;
    username?: string;
}
export declare class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private jwtService;
    private notificationService;
    server: Server;
    private connectedUsers;
    constructor(jwtService: JwtService, notificationService: NotificationService);
    handleConnection(client: AuthenticatedSocket): Promise<void>;
    handleDisconnect(client: AuthenticatedSocket): void;
    handleJoinRoom(client: AuthenticatedSocket, data: {
        room: string;
    }): void;
    handleLeaveRoom(client: AuthenticatedSocket, data: {
        room: string;
    }): void;
    emitNewComment(comment: any, authorId: string): Promise<void>;
    emitNewReply(reply: any, parentComment: any, authorId: string): Promise<void>;
    emitCommentLike(like: any, comment: any, userId: string): Promise<void>;
    emitNewFollower(follow: any, followerId: string): Promise<void>;
    emitCommentUpdate(comment: any): void;
    emitCommentDelete(commentId: string): void;
    isUserOnline(userId: string): boolean;
    getOnlineUsersCount(): number;
}
export {};
