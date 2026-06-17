import { Controller, Get, Param, Query, Post, UseInterceptors, UploadedFile, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProceduresService } from './procedures.service';

@Controller('procedures')
export class ProceduresController {
  constructor(private readonly proceduresService: ProceduresService) {}

  @Get()
  findAll(@Query('q') q?: string) {
    return this.proceduresService.findAll(q);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.proceduresService.findOne(+id);
  }

  @Post('import/preview')
  @UseInterceptors(FileInterceptor('file'))
  async previewImport(@UploadedFile() file: Express.Multer.File) {
    return this.proceduresService.previewImport(file.buffer);
  }

  @Post('import/execute')
  @UseInterceptors(FileInterceptor('file'))
  async executeImport(
    @UploadedFile() file: Express.Multer.File,
    @Body('overwrite') overwriteStr: string
  ) {
    const overwrite = overwriteStr === 'true';
    return this.proceduresService.executeImport(file.buffer, overwrite);
  }
}
