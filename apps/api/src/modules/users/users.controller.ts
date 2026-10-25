
import { Param, Body, Controller, Get, Post, Patch } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import {
  CreateUserSchema,
  type CreateUserDto,
  type UserResponseDto,
  type UpdateUserDto
} from '@meal-mate/schemas';

import { UsersService } from './users.service.js';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: 'List users',
    description:
      'List all users',
  })
  @ApiOkResponse({
    description: 'All users listed successfully.',
  })
  @ApiBadRequestResponse({
    description: 'The request body is invalid.',
  })
  async findAll(): Promise<UserResponseDto[]> {
    return this.usersService.findAll();
  }

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

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiOkResponse({
    description: 'User updated successfully',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(id, updateUserDto);
  }
}
