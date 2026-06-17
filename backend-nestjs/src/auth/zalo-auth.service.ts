import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { createHmac } from 'crypto';
import { firstValueFrom } from 'rxjs';
import { env, isZaloAuthConfigured } from '../config/env';

export type ZaloProfile = {
  id: string;
  name?: string;
  picture?: { data?: { url?: string } };
};

@Injectable()
export class ZaloAuthService {
  constructor(private readonly httpService: HttpService) {}

  isConfigured() {
    return isZaloAuthConfigured();
  }

  private createAppSecretProof(accessToken: string) {
    return createHmac('sha256', env.zaloAppSecret!)
      .update(accessToken)
      .digest('hex');
  }

  async verifyAccessToken(accessToken: string): Promise<ZaloProfile> {
    if (!isZaloAuthConfigured()) {
      throw new UnauthorizedException('Zalo auth chưa được cấu hình trên server');
    }

    try {
      const response = await firstValueFrom(
        this.httpService.get<ZaloProfile>('https://graph.zalo.me/v2.0/me', {
          params: { fields: 'id,name,picture' },
          headers: {
            access_token: accessToken,
            appsecret_proof: this.createAppSecretProof(accessToken),
          },
        }),
      );

      if (!response.data?.id) {
        throw new UnauthorizedException('Access token Zalo không hợp lệ');
      }

      return response.data;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('Không thể xác thực tài khoản Zalo');
    }
  }
}
