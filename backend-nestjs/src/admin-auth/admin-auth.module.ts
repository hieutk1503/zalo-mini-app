import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AdminAuthService } from './admin-auth.service';
import { AdminAuthController } from './admin-auth.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'SUPER_SECRET_KEY_VISS_SOFT',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AdminAuthService],
  controllers: [AdminAuthController],
  exports: [AdminAuthService],
})
export class AdminAuthModule {}
