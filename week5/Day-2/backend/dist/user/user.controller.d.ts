import { UserService } from "./user.service";
import type { UpdateProfileDto } from "../dto/user.dto";
import { UploadService } from "../upload/upload.service";
export declare class UserController {
    private userService;
    private uploadService;
    constructor(userService: UserService, uploadService: UploadService);
    getMyProfile(req: Request): Promise<{
        message: string;
        user: import("../schemas/user.schema").UserDocument;
    }>;
    updateProfile(req: Request, updateProfileDto: UpdateProfileDto): Promise<{
        message: string;
        user: import("../schemas/user.schema").UserDocument;
    }>;
    uploadProfilePicture(req: Request, file: Express.Multer.File): Promise<{
        message: string;
        user: import("../schemas/user.schema").UserDocument;
        url: string;
    }>;
    getUserByUsername(username: string): Promise<{
        message: string;
        user: import("../schemas/user.schema").UserDocument;
    }>;
    getAllUsers(): Promise<{
        message: string;
        users: import("../schemas/user.schema").UserDocument[];
    }>;
}
