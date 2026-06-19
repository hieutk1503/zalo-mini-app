import { UseGuards, Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdminAuthGuard } from '../admin-auth/admin-auth.guard';
import { FormTemplateService } from './form-template.service';
import { CreateFormTemplateDto } from './dto/create-form-template.dto';
import { UpdateFormTemplateDto } from './dto/update-form-template.dto';

@Controller('form-template')
export class FormTemplateController {
  constructor(private readonly formTemplateService: FormTemplateService) {}

  @Post()
  @UseGuards(AdminAuthGuard)
  create(@Body() createFormTemplateDto: CreateFormTemplateDto) {
    return this.formTemplateService.create(createFormTemplateDto);
  }

  @Get()
  findAll() {
    return this.formTemplateService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.formTemplateService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AdminAuthGuard)
  update(@Param('id') id: string, @Body() updateFormTemplateDto: UpdateFormTemplateDto) {
    return this.formTemplateService.update(+id, updateFormTemplateDto);
  }

  @Delete(':id')
  @UseGuards(AdminAuthGuard)
  remove(@Param('id') id: string) {
    return this.formTemplateService.remove(+id);
  }
}
