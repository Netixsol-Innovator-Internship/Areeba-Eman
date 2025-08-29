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
exports.LikeController = void 0;
const common_1 = require("@nestjs/common");
const like_service_1 = require("./like.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let LikeController = class LikeController {
    constructor(likeService) {
        this.likeService = likeService;
    }
    async toggleLike(commentId, req) {
        const user = req.user;
        const isLiked = await this.likeService.isCommentLikedByUser(user._id, commentId);
        if (isLiked) {
            await this.likeService.unlikeComment(user._id, commentId);
            return {
                message: "Comment unliked successfully",
                liked: false,
            };
        }
        else {
            await this.likeService.likeComment(user._id, commentId);
            return {
                message: "Comment liked successfully",
                liked: true,
            };
        }
    }
    async getCommentLikes(commentId) {
        const likes = await this.likeService.getCommentLikes(commentId);
        return {
            message: "Comment likes retrieved successfully",
            likes,
            count: likes.length,
        };
    }
    async getMyLikes(req) {
        const user = req.user;
        const likes = await this.likeService.getUserLikes(user._id);
        return {
            message: "Your likes retrieved successfully",
            likes,
        };
    }
    async checkIfLiked(commentId, req) {
        const user = req.user;
        const isLiked = await this.likeService.isCommentLikedByUser(user._id, commentId);
        return {
            message: "Like status retrieved successfully",
            isLiked,
        };
    }
};
exports.LikeController = LikeController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)("comment/:commentId"),
    __param(0, (0, common_1.Param)("commentId")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LikeController.prototype, "toggleLike", null);
__decorate([
    (0, common_1.Get)("comment/:commentId"),
    __param(0, (0, common_1.Param)("commentId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LikeController.prototype, "getCommentLikes", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)("user/my-likes"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LikeController.prototype, "getMyLikes", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)("comment/:commentId/check"),
    __param(0, (0, common_1.Param)("commentId")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LikeController.prototype, "checkIfLiked", null);
exports.LikeController = LikeController = __decorate([
    (0, common_1.Controller)("likes"),
    __metadata("design:paramtypes", [like_service_1.LikeService])
], LikeController);
//# sourceMappingURL=like.controller.js.map