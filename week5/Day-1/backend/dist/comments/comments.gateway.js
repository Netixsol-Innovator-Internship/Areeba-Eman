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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const comments_service_1 = require("./comments.service");
const auth_service_1 = require("../auth/auth.service");
let CommentsGateway = class CommentsGateway {
    constructor(comments, auth) {
        this.comments = comments;
        this.auth = auth;
        this.userToSocket = new Map();
        this.socketToUser = new Map();
    }
    handleConnection(client) {
        client.emit('all_comments', this.comments.getAll());
    }
    handleDisconnect(client) {
        const user = this.socketToUser.get(client.id);
        if (user) {
            this.userToSocket.delete(user);
            this.socketToUser.delete(client.id);
            this.emitUsersOnline();
        }
    }
    emitUsersOnline() {
        this.server.emit('users_online', Array.from(this.userToSocket.keys()));
    }
    identify(client, username) {
        if (!username)
            return;
        this.userToSocket.set(username, client.id);
        this.socketToUser.set(client.id, username);
        client.join(`user:${username}`);
        this.emitUsersOnline();
    }
    addComment(client, body) {
        const creator = client.id;
        const payload = this.comments.create(body.user, body.text, body.to ?? null, creator);
        if (payload.to) {
            const recipientRoom = `user:${payload.to}`;
            client.to(recipientRoom).emit('new_comment', payload);
            client.emit('new_comment', payload);
        }
        else {
            this.server.emit('new_comment', payload);
        }
    }
    deleteComment(client, id) {
        const res = this.comments.delete(Number(id), client.id);
        if (res.ok) {
            this.server.emit('delete_comment', Number(id));
        }
        else {
            client.emit('delete_failed', { id, reason: 'not-owner-or-missing' });
        }
    }
    dm(client, body) {
        const from = this.socketToUser.get(client.id) || 'unknown';
        const room = `user:${body.to}`;
        const dmPayload = { from, to: body.to, text: body.text };
        client.to(room).emit('dm', dmPayload);
        client.emit('dm', dmPayload);
    }
};
exports.CommentsGateway = CommentsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], CommentsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('identify'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], CommentsGateway.prototype, "identify", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('add_comment'),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], CommentsGateway.prototype, "addComment", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('delete_comment'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Number]),
    __metadata("design:returntype", void 0)
], CommentsGateway.prototype, "deleteComment", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('dm'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], CommentsGateway.prototype, "dm", null);
exports.CommentsGateway = CommentsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(3000, {
        cors: { origin: '*' },
    }),
    __metadata("design:paramtypes", [comments_service_1.CommentsService,
        auth_service_1.AuthService])
], CommentsGateway);
//# sourceMappingURL=comments.gateway.js.map