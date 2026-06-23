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
      
      // Ép gửi Headers ngay lập tức để Zalo App biết đã kết nối thành công (Tắt dấu ...)
      res.flushHeaders();

      // Nhận chữ nào từ Python là nhả thẳng ra Zalo chữ đó (Không gom cục)
      stream.on('data', (chunk) => {
        res.write(chunk);
        // Nếu có thư viện compression, cần gọi flush(). Ở đây mặc định của Node sẽ tự đẩy.
        if (typeof (res as any).flush === 'function') {
          (res as any).flush();
        }
      });

      stream.on('end', () => {
        res.end();
      });

      stream.on('error', (err) => {
        console.error('Stream error:', err);
        res.end();
      });

    } catch (error) {
      if (!res.headersSent) {
        res.status(500).json({ message: 'Lỗi khi kết nối với AI Service' });
      } else {
        res.end();
      }
    }
  }
}
