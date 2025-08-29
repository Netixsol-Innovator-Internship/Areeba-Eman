import { ConfigService } from "@nestjs/config";
export declare class UploadService {
    private configService;
    constructor(configService: ConfigService);
    getFileUrl(filename: string): string;
    deleteFile(filename: string): void;
    extractFilenameFromUrl(url: string): string;
}
