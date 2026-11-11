import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Household } from './entities/household.entity.js';
import { HouseholdMember } from './entities/household-member.entity.js';
import { UsersModule } from '../users/users.module.js';
import { HouseholdsService } from './households.service.js';
import { HouseholdsController } from './households.controller.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Household, 
      HouseholdMember
    ]), 
    UsersModule
  ],
  controllers: [HouseholdsController],
  providers: [HouseholdsService]
})
export class HouseholdsModule {}