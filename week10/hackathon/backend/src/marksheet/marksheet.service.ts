import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import { AssignmentResult } from '../assignment/interfaces';
import * as crypto from 'crypto';

@Injectable()
export class MarksheetService {
  async generateMarksheet(results: AssignmentResult[]): Promise<string> {
    // ✅ Use /tmp in serverless or fallback to local 'output'
    const baseDir =
      process.env.NODE_ENV === 'production'
        ? '/tmp' // writable in AWS Lambda, Railway, etc.
        : path.join(process.cwd(), 'output');

    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true });
    }

    // Prepare worksheet
    const worksheetData = [
      ['Student Name', 'Roll Number', 'Score', 'Remarks'],
      ...results.map(r => [r.studentName, r.rollNumber, r.score, r.remarks]),
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Prepare workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Marks');

    // Save file
    const fileName = `marksheet-${crypto.randomUUID()}.xlsx`;
    const filePath = path.join(baseDir, fileName);
    XLSX.writeFile(workbook, filePath);

    // ✅ If you're running locally, return a public URL
    //    In production, you might upload to S3 or return buffer
    const publicUrl =
      process.env.NODE_ENV === 'production'
        ? filePath // serverless can't host static files
        : `http://localhost:3000/output/${fileName}`;

    return publicUrl;
  }
}
