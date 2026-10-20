import {
  Body,
  Controller,
  Post,
  SerializeOptions,
  StandardSchemaSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';

import {
  CreateUserSchema,
  UserResponseSchema,
  type CreateUserDto,
  type UserResponseDto,
} from '@meal-mate/schemas';

import { UserService } from './users.service.js';

@Controller('users')
@UseInterceptors(StandardSchemaSerializerInterceptor)
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @SerializeOptions({ schema: UserResponseSchema })
  createUser(
    @Body({ schema: CreateUserSchema }) createUserDto: CreateUserDto,
  ): UserResponseDto {
    return this.userService.create(createUserDto);
  }
}