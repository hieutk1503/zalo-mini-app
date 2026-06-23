import { Controller, Post, Body, Res } from '@nestjs/common';
import { ChatService } from './chat.service';
import type { Response } from 'express';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('query')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async queryChat(
    @Body('query') query: string, 
    @Body('history') history: any[],
    @Res() res: Response
  ) {
    try {
      const stream = await this.chatService.askAiStream(query, history);
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      stream.pipe(res);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi kết nối với AI Service' });
    }
  }
}
