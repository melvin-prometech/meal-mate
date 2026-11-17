import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from '@meal-mate/schemas';
import { Repository } from 'typeorm';
import { HouseholdMember } from '../../households/entities/household-member.entity.js';
import type { AuthenticatedRequest } from '../../../types/authenticated-request.js';

@Injectable()
export class HouseholdGuard implements CanActivate {
  constructor(
    @InjectRepository(HouseholdMember)
    private readonly membershipsRepository: Repository<HouseholdMember>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    if (!request.user) {
      throw new UnauthorizedException('Authentication is required');
    }

    if (request.user.role === UserRole.ADMIN) {
      return true;
    }

    const householdIdParam = request.params.householdId;
    const householdId = Array.isArray(householdIdParam)
      ? householdIdParam[0]
      : householdIdParam;
    if (!householdId) {
      throw new ForbiddenException('A household ID is required for this route');
    }

    const membership = await this.membershipsRepository.findOneBy({
      householdId,
      userId: request.user.id,
    });

    if (!membership) {
      throw new ForbiddenException('Household membership is required');
    }

    request.householdMembership = membership;
    return true;
  }
}
