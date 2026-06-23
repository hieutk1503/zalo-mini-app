import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { env } from '../config/env';

@Injectable()
export class AiSyncService {
  private readonly logger = new Logger(AiSyncService.name);
  private readonly AI_SERVICE_URL = env.aiServiceUrl;

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
      await this.syncItem('PROCEDURE', proc.id, chunk);
    }

    // 3. Đồng bộ Tin tức
    const news = await this.prisma.news.findMany();
    for (const item of news) {
      // Bỏ tag HTML đơn giản (nếu có) để AI đọc text thuần tốt hơn, hoặc gửi nguyên HTML
      const chunk = `[Tin tức: ${item.title}] Nội dung: ${item.content}`;
      await this.syncItem('NEWS', item.id, chunk);
    }

    // 4. Đồng bộ Văn bản
    const docs = await this.prisma.document.findMany();
    for (const doc of docs) {
      const chunk = `[Văn bản: ${doc.document_no}] Trích yếu: ${doc.abstract}`;
      await this.syncItem('DOCUMENT', doc.id, chunk);
    }

    // 5. Đồng bộ Quy hoạch
    const plannings = await this.prisma.planning.findMany();
    for (const item of plannings) {
      const chunk = `[Quy hoạch] ${item.title}: ${item.content}`;
      await this.syncItem('PLANNING', item.id, chunk);
    }

    // 6. Đồng bộ Dự án đầu tư
    const projects = await this.prisma.investmentProject.findMany();
    for (const item of projects) {
      const chunk = `[Dự án đầu tư] ${item.project_name}: ${item.description} - Trạng thái: ${item.status} - Ngân sách: ${item.budget} VNĐ`;
      await this.syncItem('INVESTMENT_PROJECT', item.id, chunk);
    }

    // 7. Đồng bộ Đấu thầu
    const biddings = await this.prisma.bidding.findMany();
    for (const item of biddings) {
      const chunk = `[Đấu thầu] Tên gói thầu: ${item.package_name} - Giá: ${item.price} VNĐ`;
      await this.syncItem('BIDDING', item.id, chunk);
    }

    // 8. Đồng bộ Lịch làm việc
    const schedules = await this.prisma.workSchedule.findMany();
    for (const item of schedules) {
      // Đảm bảo không bị lỗi nếu event_date null dù schema báo không null
      const dateStr = item.event_date ? item.event_date.toLocaleDateString('vi-VN') : '';
      const chunk = `[Lịch làm việc] ${item.title} - Thời gian: ${item.time || ''} ngày ${dateStr} - Địa điểm: ${item.location || ''} - Thành phần: ${item.attendees || ''}`;
      await this.syncItem('WORK_SCHEDULE', item.id, chunk);
    }

    this.logger.log('Hoàn thành đồng bộ toàn bộ dữ liệu.');
    return { status: 'success', message: 'Sync completed successfully' };
  }

  public async syncItem(
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

  public async deleteItem(sourceType: string, sourceId: number) {
    try {
      await lastValueFrom(
        this.httpService.delete(`${this.AI_SERVICE_URL}/api/embeddings/sync/${sourceType}/${sourceId}`),
      );
      this.logger.debug(`Deleted AI vector for ${sourceType} ID ${sourceId}`);
    } catch (error) {
      this.logger.error(`Lỗi khi delete ${sourceType} ID ${sourceId}`, error);
    }
  }
}
