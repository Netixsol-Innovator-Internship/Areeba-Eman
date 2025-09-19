// src/pdf/pdf.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PdfController } from './pdf.controller';
import { PdfService } from './pdf.service';
import { PdfDoc, PdfDocSchema } from './schemas/pdf.schema';

@Module({
  imports: [
     MongooseModule.forFeature([{ name: PdfDoc.name, schema: PdfDocSchema }]),
  ],
  controllers: [PdfController],
  providers: [PdfService],
})
export class PdfModule {}
