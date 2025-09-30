import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
import { CricketService } from './cricket.service';


@Controller('cricket')
export class CricketController {
  constructor(private cricketService: CricketService) {}

  // @Post('upload')
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadCSV(
  //   @UploadedFile() file: Express.Multer.File,
  //   @Body('type') type: string, // 'test' | 'odi' | 't20'
  // ) {
  //   return this.cricketService.uploadCSV(file, type);
  // }

  @Post('ask')
  async askQuestion(@Body('question') question: string) {
      try {
    const answer = await this.cricketService.ask(question);
    return { answer: answer ?? "No data found." };
  } catch (err: any) {
    console.error(err);
    if (err.status === 429) {
      return { answer: "Quota exceeded for Gemini API. Please try again later." };
    }
    return { answer: "Error processing question." };
  }
  }
}
