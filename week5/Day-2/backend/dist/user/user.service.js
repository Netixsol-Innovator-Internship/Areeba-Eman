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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const user_schema_1 = require("../schemas/user.schema");
let UserService = class UserService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async findById(id) {
        const user = await this.userModel.findById(id).select("-password");
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        return user;
    }
    async findByUsername(username) {
        const user = await this.userModel.findOne({ username }).select("-password");
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        return user;
    }
    async updateProfile(id, updateProfileDto) {
        const user = await this.userModel.findByIdAndUpdate(id, updateProfileDto, { new: true }).select("-password");
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        return user;
    }
    async getAllUsers() {
        return this.userModel.find().select("-password").sort({ createdAt: -1 });
    }
    async incrementFollowersCount(userId) {
        await this.userModel.findByIdAndUpdate(userId, {
            $inc: { followersCount: 1 },
        });
    }
    async decrementFollowersCount(userId) {
        await this.userModel.findByIdAndUpdate(userId, {
            $inc: { followersCount: -1 },
        });
    }
    async incrementFollowingCount(userId) {
        await this.userModel.findByIdAndUpdate(userId, {
            $inc: { followingCount: 1 },
        });
    }
    async decrementFollowingCount(userId) {
        await this.userModel.findByIdAndUpdate(userId, {
            $inc: { followingCount: -1 },
        });
    }
    async updateProfilePic(userId, profilePicUrl) {
        const user = await this.userModel
            .findByIdAndUpdate(userId, { profilePicture: profilePicUrl }, { new: true })
            .select("-password");
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        return user;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [Function])
], UserService);
//# sourceMappingURL=user.service.js.map