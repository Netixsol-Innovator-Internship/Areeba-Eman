"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const notification_service_1 = require("../notification/notification.service");
let NotificationGateway = class NotificationGateway {
    constructor(jwtService, notificationService) {
        this.jwtService = jwtService;
        this.notificationService = notificationService;
        this.connectedUsers = new Map();
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth.token || client.handshake.headers.authorization?.split(" ")[1];
            if (!token) {
                client.disconnect();
                return;
            }
            const payload = this.jwtService.verify(token);
            client.userId = payload.sub;
            client.username = payload.username;
            this.connectedUsers.set(client.userId, client.id);
            client.join(`user_${client.userId}`);
            console.log(`User ${client.username} connected with socket ${client.id}`);
            const unreadCount = await this.notificationService.getUnreadCount(client.userId);
            client.emit("unread_count", { count: unreadCount });
        }
        catch (error) {
            console.error("WebSocket authentication failed:", error);
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        if (client.userId) {
            this.connectedUsers.delete(client.userId);
            console.log(`User ${client.username} disconnected`);
        }
    }
    handleJoinRoom(client, data) {
        client.join(data.room);
        client.emit("joined_room", { room: data.room });
    }
    handleLeaveRoom(client, data) {
        client.leave(data.room);
        client.emit("left_room", { room: data.room });
    }
    async emitNewComment(comment, authorId) {
        const notification = await this.notificationService.createNotification("all", authorId, "comment", `${comment.author.username} posted a new comment`, comment._id);
        const notificationDoc = notification;
        this.server.emit("new_comment", {
            comment,
            notification: {
                id: notificationDoc._id,
                message: notificationDoc.message,
                type: notificationDoc.type,
                sender: comment.author,
                createdAt: notificationDoc.createdAt,
            },
        });
    }
    async emitNewReply(reply, parentComment, authorId) {
        if (parentComment.author._id.toString() !== authorId) {
            const notification = await this.notificationService.createNotification(parentComment.author._id, authorId, "reply", `${reply.author.username} replied to your comment`, reply._id);
            const notificationDoc = notification;
            this.server.to(`user_${parentComment.author._id}`).emit("new_reply", {
                reply,
                parentComment,
                notification: {
                    id: notificationDoc._id,
                    message: notificationDoc.message,
                    type: notificationDoc.type,
                    sender: reply.author,
                    createdAt: notificationDoc.createdAt,
                },
            });
            const unreadCount = await this.notificationService.getUnreadCount(parentComment.author._id);
            this.server.to(`user_${parentComment.author._id}`).emit("unread_count", { count: unreadCount });
        }
    }
    async emitCommentLike(like, comment, userId) {
        if (comment.author._id.toString() !== userId) {
            const notification = await this.notificationService.createNotification(comment.author._id, userId, "like", `${like.user.username} liked your comment`, comment._id);
            const notificationDoc = notification;
            this.server.to(`user_${comment.author._id}`).emit("comment_liked", {
                like,
                comment,
                notification: {
                    id: notificationDoc._id,
                    message: notificationDoc.message,
                    type: notificationDoc.type,
                    sender: like.user,
                    createdAt: notificationDoc.createdAt,
                },
            });
            const unreadCount = await this.notificationService.getUnreadCount(comment.author._id);
            this.server.to(`user_${comment.author._id}`).emit("unread_count", { count: unreadCount });
        }
    }
    async emitNewFollower(follow, followerId) {
        const notification = await this.notificationService.createNotification(follow.following._id, followerId, "follow", `${follow.follower.username} started following you`);
        const notificationDoc = notification;
        this.server.to(`user_${follow.following._id}`).emit("new_follower", {
            follow,
            notification: {
                id: notificationDoc._id,
                message: notificationDoc.message,
                type: notificationDoc.type,
                sender: follow.follower,
                createdAt: notificationDoc.createdAt,
            },
        });
        const unreadCount = await this.notificationService.getUnreadCount(follow.following._id);
        this.server.to(`user_${follow.following._id}`).emit("unread_count", { count: unreadCount });
    }
    emitCommentUpdate(comment) {
        this.server.emit("comment_updated", { comment });
    }
    emitCommentDelete(commentId) {
        this.server.emit("comment_deleted", { commentId });
    }
    isUserOnline(userId) {
        return this.connectedUsers.has(userId);
    }
    getOnlineUsersCount() {
        return this.connectedUsers.size;
    }
};
exports.NotificationGateway = NotificationGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", Function)
], NotificationGateway.prototype, "server", void 0);
exports.NotificationGateway = NotificationGateway = __decorate([
    (0, common_1.Injectable)(),
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: process.env.FRONTEND_URL || "http://localhost:3000",
            credentials: true,
        },
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        notification_service_1.NotificationService])
], NotificationGateway);
//# sourceMappingURL=notification.gateway.js.map