import { Controller, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('query')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async queryChat(@Body('query') query: string, @Body('history') history?: any[]) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.chatService.askAi(query, history);
  }
}
