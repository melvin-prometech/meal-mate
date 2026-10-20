import { Module } from '@nestjs/common';
import { UsersController } from './users.controller.js';
import { UserService } from './users.service.js';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [UserService],
})
export class UsersModule {}
