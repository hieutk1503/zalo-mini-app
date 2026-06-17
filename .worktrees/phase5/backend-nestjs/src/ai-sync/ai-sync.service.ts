import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AiSyncService {
  private readonly logger = new Logger(AiSyncService.name);
  private readonly AI_SERVICE_URL = 'http://127.0.0.1:8000';

  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  async syncAllKnowledge() {
    this.logger.log('Bắt đầu đồng bộ dữ liệu sang AI Service...');

    // 1. Xóa toàn bộ dữ liệu cũ
    try {
      await lastValueFrom(
        this.httpService.delete(`${this.AI_SERVICE_URL}/api/embeddings/clear`),
      );
      this.logger.log('Đã xóa dữ liệu vector cũ trên AI Service');
    } catch (error) {
      this.logger.error('Lỗi khi xóa vector cũ', error);
      throw error;
    }

    // 2. Đồng bộ Thủ tục hành chính
    const procedures = await this.prisma.administrativeProcedure.findMany({
      where: { is_active: true },
    });
    for (const proc of procedures) {
      const chunk = `[Thủ tục: ${proc.code}] ${proc.title} - ${proc.description || ''} - Lệ phí: ${proc.fee || 'Không'} - Thời gian: ${proc.duration || 'Không'}`;
      await this.sendToAi('PROCEDURE', proc.id, chunk);
    }

    // 3. Đồng bộ Tin tức
    const news = await this.prisma.news.findMany();
    for (const item of news) {
      // Bỏ tag HTML đơn giản (nếu có) để AI đọc text thuần tốt hơn, hoặc gửi nguyên HTML
      const chunk = `[Tin tức: ${item.title}] Nội dung: ${item.content}`;
      await this.sendToAi('NEWS', item.id, chunk);
    }

    // 4. Đồng bộ Văn bản
    const docs = await this.prisma.document.findMany();
    for (const doc of docs) {
      const chunk = `[Văn bản: ${doc.document_no}] Trích yếu: ${doc.abstract}`;
      await this.sendToAi('DOCUMENT', doc.id, chunk);
    }

    this.logger.log('Hoàn thành đồng bộ toàn bộ dữ liệu.');
    return { status: 'success', message: 'Sync completed successfully' };
  }

  private async sendToAi(
    sourceType: string,
    sourceId: number,
    contentChunk: string,
  ) {
    try {
      await lastValueFrom(
        this.httpService.post(`${this.AI_SERVICE_URL}/api/embeddings/sync`, {
          source_type: sourceType,
          source_id: sourceId,
          content_chunk: contentChunk,
        }),
      );
      this.logger.debug(`Synced ${sourceType} ID ${sourceId}`);
    } catch (error) {
      this.logger.error(`Lỗi khi sync ${sourceType} ID ${sourceId}`, error);
    }
  }
}
