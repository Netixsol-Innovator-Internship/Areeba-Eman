import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import * as fs from "fs"
import * as path from "path"

@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {}

  getFileUrl(filename: string): string {
  const baseUrl = this.configService.get<string>("BASE_URL") || "http://localhost:5000";
  return `${baseUrl}/uploads/profiles/${filename}`;
}

  deleteFile(filename: string): void {
    try {
      const filePath = path.join("./uploads/profiles", filename)
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    } catch (error) {
      console.error("Error deleting file:", error)
    }
  }

  extractFilenameFromUrl(url: string): string {
    return path.basename(url)
  }
}
