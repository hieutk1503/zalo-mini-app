import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ChatService {
  private aiServiceUrl = 'http://127.0.0.1:8000'; // Default to localhost

  constructor(private readonly httpService: HttpService) {}

  async askAi(query: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.aiServiceUrl}/api/chat/query`, { query }),
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return response.data;
    } catch {
      throw new HttpException('Lỗi khi kết nối với AI Service', 500);
    }
  }
}
