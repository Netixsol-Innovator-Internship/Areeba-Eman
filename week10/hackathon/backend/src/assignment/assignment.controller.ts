import { Controller, Post, Get, Body, UploadedFiles, UseInterceptors, Param, Res } from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';

@Controller('assignment')
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  @Post('create')
  createAssignment(@Body() dto: CreateAssignmentDto) {
    return this.assignmentService.createAssignment(dto);
  }

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadAssignments(@UploadedFiles() files: Express.Multer.File[]) {
    return this.assignmentService.evaluateAssignments(files);
  }

  // ✅ New endpoint to download the Excel
  @Get('download/:fileName')
  async downloadMarksheet(@Param('fileName') fileName: string, @Res() res: Response) {
    const filePath =
      process.env.NODE_ENV === 'production'
        ? path.join('/tmp', fileName)
        : path.join(process.cwd(), 'output', fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).send('File not found');
    }

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${fileName}"`
    );
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  }
}
