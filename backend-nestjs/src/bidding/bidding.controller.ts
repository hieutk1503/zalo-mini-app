import { UseGuards, Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdminAuthGuard } from '../admin-auth/admin-auth.guard';
import { BiddingService } from './bidding.service';
import { CreateBiddingDto } from './dto/create-bidding.dto';
import { UpdateBiddingDto } from './dto/update-bidding.dto';

@Controller('bidding')
export class BiddingController {
  constructor(private readonly biddingService: BiddingService) {}

  @Post()
  @UseGuards(AdminAuthGuard)
  create(@Body() createBiddingDto: CreateBiddingDto) {
    return this.biddingService.create(createBiddingDto);
  }

  @Get()
  findAll() {
    return this.biddingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.biddingService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AdminAuthGuard)
  update(@Param('id') id: string, @Body() updateBiddingDto: UpdateBiddingDto) {
    return this.biddingService.update(+id, updateBiddingDto);
  }

  @Delete(':id')
  @UseGuards(AdminAuthGuard)
  remove(@Param('id') id: string) {
    return this.biddingService.remove(+id);
  }
}
