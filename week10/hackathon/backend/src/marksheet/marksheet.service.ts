import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import * as crypto from 'crypto';
import { AssignmentResult } from '../assignment/interfaces';
import path from 'path';
import fs from 'fs';

@Injectable()
export class MarksheetService {
  async generateMarksheet(results: AssignmentResult[]): Promise<{ fileName: string; filePath: string; }> {
  const baseDir =
    process.env.NODE_ENV === 'production'
      ? '/tmp'
      : path.join(process.cwd(), 'output');

  if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir, { recursive: true });

  const worksheetData = [
    ['Student Name', 'Roll Number', 'Score', 'Remarks'],
    ...results.map(r => [r.studentName, r.rollNumber, r.score, r.remarks]),
  ];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Marks');

  const fileName = `marksheet-${crypto.randomUUID()}.xlsx`;
  const filePath = path.join(baseDir, fileName);
  XLSX.writeFile(workbook, filePath);

  return { fileName, filePath };
}

}
