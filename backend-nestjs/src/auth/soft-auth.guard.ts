import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Citizen } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ZaloAuthService } from './zalo-auth.service';
import { allowDevHeaderAuth } from '../config/env';

@Injectable()
export class SoftAuthGuard implements CanActivate {
  constructor(
    private prisma: PrismaService,
    private zaloAuthService: ZaloAuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: Citizen }>();
    const accessToken = request.headers['x-zalo-access-token'] as
      | string
      | undefined;

    if (accessToken && this.zaloAuthService.isConfigured()) {
      const profile = await this.zaloAuthService.verifyAccessToken(accessToken);
      const citizen = await this.upsertCitizen(
        profile.id,
        profile.name?.trim() || 'Công dân Zalo',
        undefined,
        profile.picture?.data?.url,
      );
      request.user = citizen;
      return true;
    }

    if (allowDevHeaderAuth()) {
      return this.authenticateWithDevHeaders(request);
    }

    throw new UnauthorizedException(
      'Thiếu access token Zalo hoặc thông tin xác thực hợp lệ',
    );
  }

  private async authenticateWithDevHeaders(
    request: Request & { user?: Citizen },
  ) {
    const zaloId = request.headers['x-zalo-id'] as string | undefined;
    const fullNameRaw =
      (request.headers['x-full-name'] as string | undefined) || 'Công dân';
    const fullName = decodeURIComponent(fullNameRaw);
    const phone = (request.headers['x-phone'] as string | undefined) || '';

    if (!zaloId) {
      throw new UnauthorizedException('Thiếu zalo_id để xác thực');
    }

    const citizen = await this.upsertCitizen(zaloId, fullName, phone);
    request.user = citizen;
    return true;
  }

  private async upsertCitizen(
    zaloId: string,
    fullName: string,
    phone?: string,
    avatarUrl?: string,
  ) {
    let citizen = await this.prisma.citizen.findUnique({
      where: { zalo_id: zaloId },
    });

    if (!citizen) {
      citizen = await this.prisma.citizen.create({
        data: {
          zalo_id: zaloId,
          full_name: fullName,
          phone: phone || null,
          avatar_url: avatarUrl || null,
        },
      });
      return citizen;
    }

    const updates: Partial<Citizen> = {};
    if (fullName && fullName !== citizen.full_name) updates.full_name = fullName;
    if (phone && phone !== citizen.phone) updates.phone = phone;
    if (avatarUrl && avatarUrl !== citizen.avatar_url) {
      updates.avatar_url = avatarUrl;
    }

    if (Object.keys(updates).length === 0) return citizen;

    return this.prisma.citizen.update({
      where: { id: citizen.id },
      data: updates,
    });
  }
}
