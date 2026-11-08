// src/modules/households/households.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Household } from './entities/household.entity.js';
import { HouseholdMember } from './entities/household-member.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Household, HouseholdMember]), 
  ],
})
export class HouseholdsModule {}