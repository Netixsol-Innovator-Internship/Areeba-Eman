import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import { AssignmentResult } from '../assignment/interfaces';
import * as crypto from 'crypto';

@Injectable()
export class MarksheetService {
  async generateMarksheet(results: AssignmentResult[]): Promise<string> {
    // Ensure output directory exists
    const outputDir = path.join(process.cwd(), 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
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
    const filePath = path.join(outputDir, fileName);
    XLSX.writeFile(workbook, filePath);

    // ✅ Return a public URL instead of a local path
    const publicUrl = `http://localhost:3000/output/${fileName}`;
    return publicUrl;
  }
}
