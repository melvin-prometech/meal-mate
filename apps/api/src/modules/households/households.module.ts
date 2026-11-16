import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Household } from './entities/household.entity.js';
import { HouseholdMember } from './entities/household-member.entity.js';
import { UsersModule } from '../users/users.module.js';
import { HouseholdsService } from './households.service.js';
import { HouseholdsController } from './households.controller.js';
import { AuthModule } from '../auth/auth.module.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { User } from '../users/entities/user.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Household, 
      HouseholdMember,
      User,
    ]), 
    UsersModule,
    AuthModule,
  ],
  controllers: [HouseholdsController],
  providers: [HouseholdsService, JwtAuthGuard]
})
export class HouseholdsModule {}
