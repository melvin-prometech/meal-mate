
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import z from 'zod';
import type { CreateUserDto, UserResponseDto } from '@meal-mate/schemas';
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

  async create(data: CreateUserDto): Promise<UserResponseDto> {
    const user = this.usersRepository.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email
    });

    const savedUser = await this.usersRepository.save(user);

    return {
      id: savedUser.id,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      email: savedUser.email
    };
  }
}
