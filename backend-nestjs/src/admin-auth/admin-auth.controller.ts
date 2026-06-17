import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';

@Controller('admin-auth')
export class AdminAuthController {
  constructor(private adminAuthService: AdminAuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() loginDto: Record<string, any>) {
    return this.adminAuthService.login(loginDto.email, loginDto.password);
  }
}
