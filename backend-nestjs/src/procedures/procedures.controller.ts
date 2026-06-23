import { Controller, Get, Param, Query, Post, Patch, Delete, UseInterceptors, UploadedFile, Body, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProceduresService } from './procedures.service';
import { AdminAuthGuard } from '../admin-auth/admin-auth.guard';

@Controller('procedures')
export class ProceduresController {
  constructor(private readonly proceduresService: ProceduresService) {}

  @Get()
  async findAll(@Query('q') q?: string) {
    const items = await this.proceduresService.findAll(q);
    return {
      current: 1,
      pageSize: 10,
      total: items.length,
      data: items.map(p => ({
        id: p.id,
        question: p.title,
        answer: p.description || p.process_steps || '',
      }))
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.proceduresService.findOne(+id);
  }
  @Post()
  @UseGuards(AdminAuthGuard)
  create(@Body() data: any) {
    return this.proceduresService.create(data);
  }

  @Patch(':id')
  @UseGuards(AdminAuthGuard)
  update(@Param('id') id: string, @Body() data: any) {
    return this.proceduresService.update(+id, data);
  }

  @Delete(':id')
  @UseGuards(AdminAuthGuard)
  remove(@Param('id') id: string) {
    return this.proceduresService.remove(+id);
  }

  @Post('import/preview')
  @UseGuards(AdminAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async previewImport(@UploadedFile() file: Express.Multer.File) {
    return this.proceduresService.previewImport(file.buffer);
  }

  @Post('import/execute')
  @UseGuards(AdminAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async executeImport(
    @UploadedFile() file: Express.Multer.File,
    @Body('overwrite') overwriteStr: string
  ) {
    const overwrite = overwriteStr === 'true';
    return this.proceduresService.executeImport(file.buffer, overwrite);
  }
}
