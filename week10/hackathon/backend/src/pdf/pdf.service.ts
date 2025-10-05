import { Injectable } from '@nestjs/common';

// force CommonJS require
const pdfParse = require('pdf-parse');

@Injectable()
export class PdfService {
  async extractText(file: Express.Multer.File): Promise<string> {
    const data = await pdfParse(file.buffer); // works at runtime
    return data.text;
  }

  extractStudentName(text: string): string {
    const match = text.match(/Name:\s*(.+)/i);
    return match ? match[1].trim() : 'Unknown';
  }

  extractRollNumber(text: string): string {
    const match = text.match(/Roll\s*No:\s*(\w+)/i);
    return match ? match[1].trim() : 'Unknown';
  }
}
