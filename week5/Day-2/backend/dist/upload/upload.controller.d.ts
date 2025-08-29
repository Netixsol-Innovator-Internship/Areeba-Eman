import { UploadService } from "./upload.service";
import { UserService } from "../user/user.service";
export declare class UploadController {
    private uploadService;
    private userService;
    constructor(uploadService: UploadService, userService: UserService);
    uploadProfilePicture(file: Express.Multer.File, req: any): Promise<{
        message: string;
        url: string;
        profilePicture: string;
    }>;
}
