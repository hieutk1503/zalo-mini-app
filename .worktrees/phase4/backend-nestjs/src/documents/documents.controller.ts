import { Controller, Get, Param, Query } from '@nestjs/common';
import { DocumentsService } from './documents.service';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  findAll(@Query('type') type?: string, @Query('q') q?: string) {
    return this.documentsService.findAll(type, q);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentsService.findOne(+id);
  }
}
