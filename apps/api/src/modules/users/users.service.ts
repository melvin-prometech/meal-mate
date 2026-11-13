
import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import z from 'zod';
import type { CreateUserDto, UserResponseDto, UpdateUserDto, FindUserDto } from '@meal-mate/schemas';
import { UserResponseSchema } from '@meal-mate/schemas'
import { Repository } from 'typeorm';
import { User } from './entities/user.entity.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersRepository.find();

    return z.array(UserResponseSchema).parse(users);
  }

  async findOne(data: FindUserDto): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOneBy({
      id: data.id,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return UserResponseSchema.parse(user);
  }

  async create(data: CreateUserDto): Promise<UserResponseDto> {
    const passwordHash = await bcrypt.hash(data.password, 12);
    const user = this.usersRepository.create({
      ...data,
      password: passwordHash,
    });
    const savedUser = await this.usersRepository.save(user);

    return UserResponseSchema.parse(savedUser);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const updates = { ...updateUserDto };
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 12);
    }
    Object.assign(user, updates);

    const updatedUser = await this.usersRepository.save(user);

    return UserResponseSchema.parse(updatedUser);
  }

  async exists(id: string): Promise<boolean> {
    return this.usersRepository.existsBy({ id });
  }
  
  async remove(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }

}
