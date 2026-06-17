import { Controller, Get, Param, Query } from '@nestjs/common';
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
}
