import { Controller, Post, Body, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('assignment')
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  @Post('create')
  createAssignment(@Body() dto: CreateAssignmentDto) {
    console.log('Received assignment creation request:', dto);
    return this.assignmentService.createAssignment(dto);
  }

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files')) // ✅ no storage config → defaults to memory
  async uploadAssignments(@UploadedFiles() files: Express.Multer.File[]) {
    console.log('Received files:', files.map(file => file.originalname));
    return this.assignmentService.evaluateAssignments(files);
  }
}
