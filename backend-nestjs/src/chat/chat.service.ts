import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { env } from '../config/env';

@Injectable()
export class ChatService {
  private aiServiceUrl = env.aiServiceUrl;

  constructor(private readonly httpService: HttpService) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async askAi(query: string, history?: any[]) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.aiServiceUrl}/api/chat/query`, { 
          query,
          history: history || []
        }),
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return response.data;
    } catch {
      throw new HttpException('Lỗi khi kết nối với AI Service', 500);
    }
  }
}
