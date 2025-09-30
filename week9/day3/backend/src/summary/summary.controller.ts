import { Controller, Get, Post, Put, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { SummariesService } from './summary.service';
import { JwtAuthGuard } from '../guards/jwt.guard';

@Controller('summaries')
@UseGuards(JwtAuthGuard) // ✅ protect with JWT
export class SummariesController {
  constructor(private readonly summariesService: SummariesService) {}

  @Post()
  createSummary(
    @Req() req,
    @Body('chatId') chatId: string,
    @Body('summary') summaryText: string,
  ) {
    const userId = req.user.userId;
    return this.summariesService.createSummary(userId, chatId, summaryText);
  }


  @Put(':chatId')
  updateSummary(
    @Req() req,
    @Param('chatId') chatId: string,
    @Body('summary') summaryText: string,
  ) {
    const userId = req.user.userId;
    return this.summariesService.updateSummary(userId, chatId, summaryText);
  }

  @Get()
  getSummaries(@Req() req) {
    const userId = req.user.userId;
    return this.summariesService.getSummaries(userId);
  }

  @Get(':chatId')
  getSummaryByChat(@Req() req, @Param('chatId') chatId: string) {
    const userId = req.user.userId;
    return this.summariesService.getSummaryByChat(userId, chatId);
  }

  @Delete(':chatId')
  deleteSummary(@Req() req, @Param('chatId') chatId: string) {
    const userId = req.user.userId;
    return this.summariesService.deleteSummary(userId, chatId);
  }
}
