import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Readable } from 'stream';
import { env } from '../config/env';

@Injectable()
export class ChatService {
  private aiServiceUrl = env.aiServiceUrl;

  constructor(private readonly httpService: HttpService) {}

  async askAiStream(query: string, history?: any[]): Promise<Readable> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.aiServiceUrl}/api/chat/query`,
          {
            query,
            history: history || [],
          },
          { responseType: 'stream' },
        ),
      );

      return response.data as Readable;
    } catch {
      throw new HttpException('Lỗi khi kết nối với AI Service', 500);
    }
  }
}

