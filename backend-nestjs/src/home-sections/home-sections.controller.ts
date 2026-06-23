import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('home-sections')
export class HomeSectionsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async getHomeSections() {
    const news = await this.prisma.news.findMany({
      take: 5,
      orderBy: { published_at: 'desc' }
    });

    return [
        { id: 'hs-hero', key: 'hero', order: 1, enabled: true, title: 'CHÍNH QUYỀN SỐ', color1: '#C8102E', color2: '#7A0C16' },
        { id: 'hs-stats', key: 'stats', order: 2, enabled: true, color1: '#C8102E', color2: '#A4161A' },
        { id: 'hs-statsdss', key: 'statsDss', order: 3, enabled: true },
        { id: 'hs-explore', key: 'explore', order: 4, enabled: true, title: 'Du lịch địa phương', data: [] },
        { id: 'hs-news', key: 'newsList', order: 5, enabled: true, title: 'Tin tức', data: news },
        { id: 'hs-events', key: 'events', order: 5.5, enabled: true, title: 'Sự kiện sắp diễn ra' },
        { id: 'hs-oa', key: 'oa', order: 6, enabled: true },
        { id: 'hs-citizen', key: 'citizenGrid', order: 7, enabled: true, title: 'Dành cho công dân' },
        { id: 'hs-khupho', key: 'khuphoGrid', order: 8, enabled: true, title: 'Quản lý khu phố' },
        { id: 'hs-business', key: 'businessGrid', order: 9, enabled: true, title: 'Dành cho doanh nghiệp, tổ chức' },
        { id: 'hs-featured', key: 'featured', order: 10, enabled: true, title: 'Tin tức Chuyển Đổi Số', subtitle: 'TIN NỔI BẬT' },
    ];
  }
}
