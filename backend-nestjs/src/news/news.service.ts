import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NewsService {
  constructor(private prisma: PrismaService) {}

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

  create(data: any) {
    return this.prisma.news.create({
      data: {
        title: data.title,
        content: data.content,
        thumbnail: data.thumbnail,
      },
    });
  }

  update(id: number, data: any) {
    return this.prisma.news.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
        thumbnail: data.thumbnail,
      },
    });
  }

  remove(id: number) {
    return this.prisma.news.delete({
      where: { id },
    });
  }
}
