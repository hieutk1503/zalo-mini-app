import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiSyncService } from '../ai-sync/ai-sync.service';

@Injectable()
export class NewsService {
  constructor(
    private prisma: PrismaService,
    private aiSyncService: AiSyncService,
  ) {}

  findAll() {
    return this.prisma.news.findMany({
      orderBy: { published_at: 'desc' },
      take: 20,
    });
  }

  findOne(id: number) {
    return this.prisma.news.findUnique({
      where: { id },
    });
  }

  async create(data: any) {
    const news = await this.prisma.news.create({
      data: {
        title: data.title,
        content: data.content,
        thumbnail: data.thumbnail,
      },
    });
    
    // Sync to AI in background
    const chunk = `[Tin tức: ${news.title}] Nội dung: ${news.content}`;
    this.aiSyncService.syncItem('NEWS', news.id, chunk);
    
    return news;
  }

  async update(id: number, data: any) {
    const news = await this.prisma.news.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
        thumbnail: data.thumbnail,
      },
    });

    // Sync to AI in background
    const chunk = `[Tin tức: ${news.title}] Nội dung: ${news.content}`;
    this.aiSyncService.syncItem('NEWS', news.id, chunk);

    return news;
  }

  async remove(id: number) {
    const news = await this.prisma.news.delete({
      where: { id },
    });

    // Delete from AI vector db
    this.aiSyncService.deleteItem('NEWS', id);

    return news;
  }
}
