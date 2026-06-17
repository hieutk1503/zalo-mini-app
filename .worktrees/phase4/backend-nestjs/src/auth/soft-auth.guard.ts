import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Citizen } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SoftAuthGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: Citizen }>();
    const zaloId = request.headers['x-zalo-id'] as string | undefined;
    const fullName =
      (request.headers['x-full-name'] as string | undefined) || 'Công dân';
    const phone = (request.headers['x-phone'] as string | undefined) || '';

    if (!zaloId) {
      throw new UnauthorizedException('Thiếu zalo_id để xác thực');
    }

    let citizen = await this.prisma.citizen.findUnique({
      where: { zalo_id: zaloId },
    });
    if (!citizen) {
      citizen = await this.prisma.citizen.create({
        data: {
          zalo_id: zaloId,
          full_name: fullName,
          phone: phone,
        },
      });
    }

    // Attach citizen to request
    request.user = citizen;
    return true;
  }
}
