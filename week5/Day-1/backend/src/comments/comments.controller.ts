import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private readonly svc: CommentsService) {}

  @Get()
  getAll() {
    return this.svc.getAll();
  }

  // Optional REST create (not required by your refactored page)
  @Post()
  create(@Body() body: { user: string; text: string; to?: string | null }) {
    // creatorSocketId unknown via REST → mark as 'rest'
    return this.svc.create(body.user, body.text, body.to ?? null, 'rest');
  }

  // Optional REST delete fallback: /comments/:id?username=alice
  @Delete(':id')
  remove(@Param('id') id: string, @Query('username') username?: string) {
    if (!username) return { ok: false, reason: 'username required' };
    return this.svc.deleteByUser(Number(id), username);
  }
}
