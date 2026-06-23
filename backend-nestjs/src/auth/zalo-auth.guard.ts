import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { allowDevHeaderAuth } from '../config/env';

@Injectable()
export class ZaloAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace('Bearer ', '');

    if (!token && allowDevHeaderAuth()) {
      return true; // Dev mode: allow unauthenticated
    }

    // In production: verify token with Zalo API or check token presence
    return !!token;
  }
}
