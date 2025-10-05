import * as fs from 'fs';
import * as path from 'path';

export async function saveTempFile(file: Express.Multer.File): Promise<string> {
  const filePath = path.join(process.cwd(), 'uploads', file.originalname);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, file.buffer);
  return filePath;
}
