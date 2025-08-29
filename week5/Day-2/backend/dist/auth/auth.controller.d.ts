import { AuthService } from "./auth.service";
import { RegisterDto, LoginDto } from "../dto/auth.dto";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        token: string;
        user: {
            id: any;
            username: string;
            email: string;
            bio: string;
            profilePicture: string;
            followersCount: number;
            followingCount: number;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        message: string;
        token: string;
        user: {
            id: any;
            username: string;
            email: string;
            bio: string;
            profilePicture: string;
            followersCount: number;
            followingCount: number;
        };
    }>;
    getProfile(req: any): Promise<{
        message: string;
        user: any;
    }>;
    verifyToken(req: any): Promise<{
        message: string;
        user: any;
    }>;
}
