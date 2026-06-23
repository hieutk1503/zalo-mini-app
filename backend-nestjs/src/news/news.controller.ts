import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { NewsService } from './news.service';
import { AdminAuthGuard } from '../admin-auth/admin-auth.guard';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @UseGuards(AdminAuthGuard)
  create(@Body() createData: any) {
    return this.newsService.create(createData);
  }

  @Get()
  async findAll() {
    const news = await this.newsService.findAll();
    return {
      current: 1,
      pageSize: 10,
      total: news.length,
      data: news.map(item => ({
        id: item.id,
        title: item.title,
        thumb: item.thumbnail,
        createdAt: item.published_at.getTime(),
        desc: item.content,
        link: '',
      }))
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AdminAuthGuard)
  update(@Param('id') id: string, @Body() updateData: any) {
    return this.newsService.update(+id, updateData);
  }

  @Delete(':id')
  @UseGuards(AdminAuthGuard)
  remove(@Param('id') id: string) {
    return this.newsService.remove(+id);
  }
}
