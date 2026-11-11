import z from 'zod';
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HouseholdRole, RemoveHouseholdMemberDto } from '@meal-mate/schemas';
import { CreateHouseholdDto } from '@meal-mate/schemas';

import { Household } from './entities/household.entity.js';
import { HouseholdMember } from './entities/household-member.entity.js';
import { User } from '../users/entities/user.entity.js';
import { UsersService } from '../users/users.service.js';
import { AddHouseholdMemberDto } from '@meal-mate/schemas';
import { HouseholdResponseDto, HouseholdResponseSchema, HouseholdMemberResponseDto } from '@meal-mate/schemas';
import { mapHouseholdsToResponseDto } from './lib/households-mapper.js';
import { mapMemberToResponseDto } from './lib/households-mapper.js';

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

  async addMember(
    householdId: string,
    dto: AddHouseholdMemberDto,
  ): Promise<HouseholdMemberResponseDto> {
    const memberRepo = this.householdRepository.manager.getRepository(HouseholdMember);

    const householdExists = await this.householdRepository.exists({
      where: { id: householdId },
    });
    if (!householdExists) {
      throw new NotFoundException(`Household with ID "${householdId}" not found`);
    }

    if (!(await this.usersService.exists(dto.userId))) {
      throw new NotFoundException('User not found');
    }

    const existingMember = await memberRepo.findOne({
      where: { householdId, userId: dto.userId },
    });
    if (existingMember) {
      throw new ConflictException('User is already a member of this household');
    }

    const member = memberRepo.create({
      householdId,
      userId: dto.userId,
      role: HouseholdRole.MEMBER,
    });

    const savedMember = await memberRepo.save(member);
    const user = await this.usersService.findOne({id: dto.userId});
    savedMember.user = user as User;

    return mapMemberToResponseDto(savedMember);
  }

  async removeMember(
    householdId: string,
    dto: RemoveHouseholdMemberDto,
  ): Promise<void> {
    const memberRepo = this.householdRepository.manager.getRepository(HouseholdMember);

    if (!(await this.householdRepository.exists({ where: { id: householdId } }))) {
      throw new NotFoundException(`Household with ID "${householdId}" not found`);
    }
    if (!(await this.usersService.exists(dto.userId))) {
      throw new NotFoundException('User not found');
    }

    const member = await memberRepo.findOne({
      where: { householdId, userId: dto.userId },
    });
    if (!member) {
      throw new NotFoundException('User is not a member of this household');
    }

    await memberRepo.delete({ householdId, userId: dto.userId });
  }
}