import { Model } from "mongoose";
import { JwtService } from "@nestjs/jwt";
import { UserDocument } from "../schemas/user.schema";
import { RegisterDto, LoginDto } from "../dto/auth.dto";
export declare class AuthService {
    private readonly userModel;
    private readonly jwtService;
    constructor(userModel: Model<UserDocument>, jwtService: JwtService);
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
    validateUser(username: string, password: string): Promise<any>;
    findById(id: string): Promise<UserDocument>;
}
