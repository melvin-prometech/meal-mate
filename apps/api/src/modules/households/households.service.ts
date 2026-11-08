import z from 'zod';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HouseholdRole } from '@meal-mate/schemas';
import { CreateHouseholdDto } from '@meal-mate/schemas';

import { Household } from './entities/household.entity.js';
import { HouseholdMember } from './entities/household-member.entity.js';
import { User } from '../users/entities/user.entity.js';
import { UsersService } from '../users/users.service.js';
import { HouseholdResponseDto, HouseholdResponseSchema } from '@meal-mate/schemas';
import { mapHouseholdsToResponseDto } from './lib/households-mapper.js';

@Injectable()
export class HouseholdsService {
  constructor(
    @InjectRepository(Household)
    private readonly householdRepository: Repository<Household>,

    private readonly usersService: UsersService
  ) {}

  async findAll(): Promise<HouseholdResponseDto[]> {
    const households = await this.householdRepository.find({
      relations: {
        members: {
          user: true, 
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });

    const formatted = mapHouseholdsToResponseDto(households);

    return z.array(HouseholdResponseSchema).parse(formatted);
  }

  async createHousehold(
    userId: string,
    data: CreateHouseholdDto,
  ): Promise<{ id: string }> {
    return this.householdRepository.manager.transaction(async (manager) => {
      const householdRepo = manager.getRepository(Household);
      const memberRepo = manager.getRepository(HouseholdMember);

        if (!await this.usersService.exists(userId)) {
            throw new NotFoundException('User not found');
        }

        const household = householdRepo.create({ name: data.name });
        const savedHousehold = await householdRepo.save(household);

        const member = memberRepo.create({
            householdId: savedHousehold.id,
            userId: userId,
            role: HouseholdRole.ADMIN,
        });

        await memberRepo.save(member);

        return { id: savedHousehold.id };
    });
  }
}