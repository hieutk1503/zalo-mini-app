import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BiddingService } from './bidding.service';
import { CreateBiddingDto } from './dto/create-bidding.dto';
import { UpdateBiddingDto } from './dto/update-bidding.dto';

@Controller('bidding')
export class BiddingController {
  constructor(private readonly biddingService: BiddingService) {}

  @Post()
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
  update(@Param('id') id: string, @Body() updateBiddingDto: UpdateBiddingDto) {
    return this.biddingService.update(+id, updateBiddingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.biddingService.remove(+id);
  }
}
