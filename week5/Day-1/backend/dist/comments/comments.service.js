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
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../auth/auth.service");
let CommentsService = class CommentsService {
    constructor(auth) {
        this.auth = auth;
        this.comments = [];
        this.nextId = 1;
    }
    getAll() {
        return this.comments.map(({ creatorSocketId, ...rest }) => rest);
    }
    create(user, text, to, creatorSocketId) {
        const c = {
            id: this.nextId++,
            user,
            text,
            to: to || null,
            createdAt: Date.now(),
            creatorSocketId,
        };
        this.comments.push(c);
        this.auth.users.forEach(u => {
            if (u.username === user)
                return;
            if (to && u.username !== to)
                return;
            const label = to ? `DM from @${user}: ${text}` : `${user} commented: ${text}`;
            u.unread.push(label);
        });
        const { creatorSocketId: _omit, ...payload } = c;
        return payload;
    }
    delete(id, requesterSocketId) {
        const idx = this.comments.findIndex(c => c.id === id);
        if (idx === -1)
            return { ok: false };
        const c = this.comments[idx];
        if (c.creatorSocketId !== requesterSocketId)
            return { ok: false };
        this.comments.splice(idx, 1);
        return { ok: true };
    }
    deleteByUser(id, username) {
        const idx = this.comments.findIndex(c => c.id === id && c.user === username);
        if (idx === -1)
            return { ok: false };
        this.comments.splice(idx, 1);
        return { ok: true };
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], CommentsService);
//# sourceMappingURL=comments.service.js.map