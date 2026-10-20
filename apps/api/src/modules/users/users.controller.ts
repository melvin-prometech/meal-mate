
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

import { UserService } from './users.service.js';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

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
  createUser(
    @Body({ schema: CreateUserSchema }) data: CreateUserDto,
  ): UserResponseDto {
    return this.userService.create(data);
  }
}
