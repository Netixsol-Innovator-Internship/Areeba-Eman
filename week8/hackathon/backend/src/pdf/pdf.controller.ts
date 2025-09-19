import { Controller, Post, UseInterceptors, UploadedFile, Body, Get, Param, BadRequestException, NotFoundException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PdfService } from './pdf.service';


@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPdf(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    console.log('📁 Received file:', file.originalname);
    const saved = await this.pdfService.savePdf(file);
    console.log('✅ Saved PDF:', saved);
    return saved;
  }


  @Get(':id')
  async getPdf(@Param('id') id: string) {
  const pdf = await this.pdfService.getPdfMetadata(id);
    if (!pdf) {
      throw new NotFoundException('PDF not found');
    }
    return pdf;
  }

  @Post(':id/ask')
    ask(
      @Param('id') id: string,
      @Body('question') question: string
    ) {
      return this.pdfService.askQuestion(id, question);
  }

  @Get()
  async getAllPdfs() {
    return this.pdfService.getAllPdfs();
  }
  
}
