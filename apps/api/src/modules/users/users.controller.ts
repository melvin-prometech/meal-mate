
import { Param, Body, Controller, Get, Post, Patch, Delete, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { AdminGuard } from '../auth/guards/admin.guard.js';

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, AdminGuard)
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

  @Get(':id')
  @ApiOperation({
    summary: 'Get a user',
    description: 'Retrieve a user by their ID.',
  })
  @ApiOkResponse({
    description: 'User retrieved successfully.',
  })
  @ApiNotFoundResponse({
    description: 'User not found.',
  })
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.findOne({ id });
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

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiOkResponse({
    description: 'User deleted successfully',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
