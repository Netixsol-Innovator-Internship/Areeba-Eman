"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikeModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const like_service_1 = require("./like.service");
const like_controller_1 = require("./like.controller");
const like_schema_1 = require("../schemas/like.schema");
const comment_module_1 = require("../comment/comment.module");
const websocket_module_1 = require("../websocket/websocket.module");
let LikeModule = class LikeModule {
};
exports.LikeModule = LikeModule;
exports.LikeModule = LikeModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: like_schema_1.Like.name, schema: like_schema_1.LikeSchema }]),
            comment_module_1.CommentModule,
            (0, common_1.forwardRef)(() => websocket_module_1.WebsocketModule),
        ],
        providers: [like_service_1.LikeService],
        controllers: [like_controller_1.LikeController],
        exports: [like_service_1.LikeService],
    })
], LikeModule);
//# sourceMappingURL=like.module.js.map