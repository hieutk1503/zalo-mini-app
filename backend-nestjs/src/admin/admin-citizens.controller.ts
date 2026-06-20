import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminCitizensService } from './admin-citizens.service';
import { AdminAuthGuard } from '../admin-auth/admin-auth.guard';

@Controller('admin/citizens')
@UseGuards(AdminAuthGuard)
export class AdminCitizensController {
  constructor(private readonly adminCitizensService: AdminCitizensService) {}

  @Get()
  findAll() {
    return this.adminCitizensService.findAll();
  }
}
