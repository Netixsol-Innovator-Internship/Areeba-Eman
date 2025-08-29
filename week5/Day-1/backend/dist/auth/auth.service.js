"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
let AuthService = class AuthService {
    constructor() {
        this.users = [];
    }
    signup(username, password) {
        if (!username || !password)
            throw new common_1.BadRequestException('Missing fields');
        if (username.length < 3)
            throw new common_1.BadRequestException('Username too short');
        if (password.length < 6)
            throw new common_1.BadRequestException('Password too short');
        if (this.users.find(u => u.username === username)) {
            throw new common_1.BadRequestException('User already exists');
        }
        const user = { username, password, unread: [] };
        this.users.push(user);
        return user;
    }
    login(username, password) {
        const user = this.users.find(u => u.username === username && u.password === password);
        if (!user)
            throw new common_1.UnauthorizedException('Invalid credentials');
        return user;
    }
    find(username) {
        return this.users.find(u => u.username === username);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)()
], AuthService);
//# sourceMappingURL=auth.service.js.map