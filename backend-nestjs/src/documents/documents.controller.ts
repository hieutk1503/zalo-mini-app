import { Controller, Get, Param, Query, Post, Body, Patch, Delete, UseGuards } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { AdminAuthGuard } from '../admin-auth/admin-auth.guard';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @UseGuards(AdminAuthGuard)
  create(@Body() createData: any) {
    return this.documentsService.create(createData);
  }

  @Get()
  findAll(@Query('type') type?: string, @Query('q') q?: string) {
    return this.documentsService.findAll(type, q);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AdminAuthGuard)
  update(@Param('id') id: string, @Body() updateData: any) {
    return this.documentsService.update(+id, updateData);
  }

  @Delete(':id')
  @UseGuards(AdminAuthGuard)
  remove(@Param('id') id: string) {
    return this.documentsService.remove(+id);
  }
}
