
import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import {
  CreateUserSchema,
  type CreateUserDto,
  type UserResponseDto,
} from '@meal-mate/schemas';

import { UsersService } from './users.service.js';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a user',
    description:
      'Creates a new user using the provided name and email address.',
  })
  @ApiCreatedResponse({
    description: 'The user was successfully created.',
  })
  @ApiBadRequestResponse({
    description: 'The request body is invalid.',
  })
  async createUser(
    @Body({ schema: CreateUserSchema }) data: CreateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.create(data);
  }
}
