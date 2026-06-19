import { UseGuards, Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdminAuthGuard } from '../admin-auth/admin-auth.guard';
import { InvestmentService } from './investment.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { UpdateInvestmentDto } from './dto/update-investment.dto';

@Controller('investment')
export class InvestmentController {
  constructor(private readonly investmentService: InvestmentService) {}

  @Post()
  @UseGuards(AdminAuthGuard)
  create(@Body() createInvestmentDto: CreateInvestmentDto) {
    return this.investmentService.create(createInvestmentDto);
  }

  @Get()
  findAll() {
    return this.investmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.investmentService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AdminAuthGuard)
  update(@Param('id') id: string, @Body() updateInvestmentDto: UpdateInvestmentDto) {
    return this.investmentService.update(+id, updateInvestmentDto);
  }

  @Delete(':id')
  @UseGuards(AdminAuthGuard)
  remove(@Param('id') id: string) {
    return this.investmentService.remove(+id);
  }
}
