import { Module } from '@nestjs/common';
import { AssignmentController } from './assignment/assignment.controller';
import { AssignmentService } from './assignment/assignment.service';
import { PdfService } from './pdf/pdf.service';
import { GenAiService } from './genai/genai.service';
import { MarksheetService } from './marksheet/marksheet.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // so you don’t need to re-import everywhere
    }),
  ],
  controllers: [AssignmentController],
  providers: [AssignmentService, PdfService, GenAiService, MarksheetService],
})
export class AppModule {}
