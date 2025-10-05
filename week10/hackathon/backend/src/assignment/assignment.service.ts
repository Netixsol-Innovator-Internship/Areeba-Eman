import { Injectable } from '@nestjs/common';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { PdfService } from '../pdf/pdf.service';
import { GenAiService } from '../genai/genai.service';
import { MarksheetService } from '../marksheet/marksheet.service';
import { AssignmentResult } from './interfaces';

@Injectable()
export class AssignmentService {
  private assignmentConfig: CreateAssignmentDto | null = null;

  constructor(
    private readonly pdfService: PdfService,
    private readonly genAiService: GenAiService,
    private readonly marksheetService: MarksheetService,
  ) {}

  createAssignment(dto: CreateAssignmentDto) {
    this.assignmentConfig = dto;
    return { message: 'Assignment created', config: dto };
  }

  async evaluateAssignments(files: Express.Multer.File[]) {
  if (!this.assignmentConfig) {
    return { error: 'No assignment configured yet' };
  }

  const results: AssignmentResult[] = [];

  for (const file of files) {
    const text = await this.pdfService.extractText(file);

    // ---- Extract from filename instead of essay text ----
    const originalName = file.originalname.replace(/\.[^/.]+$/, ""); // remove extension
    // e.g. "Wasif_078"
    const [studentName, rollNumber] = originalName.split("_");

    const evaluation = await this.genAiService.evaluateText(
      this.assignmentConfig,
      text
    );

    results.push({
      studentName: studentName || "Unknown",
      rollNumber: rollNumber || "Unknown",
      score: evaluation.score,
      remarks: evaluation.remarks,
    });
  }

  const marksheetPath = await this.marksheetService.generateMarksheet(results);
  // console.log('Marksheet generated at:', marksheetPath);
  // console.log('Results:', results, marksheetPath);
  return { results, marksheet: marksheetPath };
}

}
