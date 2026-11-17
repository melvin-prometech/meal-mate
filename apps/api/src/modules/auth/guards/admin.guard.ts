import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRole } from '@meal-mate/schemas';
import type { AuthenticatedRequest } from '../../../types/authenticated-request.js';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    if (!request.user) {
      throw new UnauthorizedException('Authentication is required');
    }

    if (request.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Global administrator access is required');
    }

    return true;
  }
}
