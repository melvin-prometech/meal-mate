
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { CreateUserDto, UserResponseDto } from '@meal-mate/schemas';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(data: CreateUserDto): Promise<UserResponseDto> {
    const user = this.usersRepository.create({
      firstName: data.firstName,
      lastName: data.lastName
      email: data.email,
    });

    const savedUser = await this.usersRepository.save(user);

    return {
      id: savedUser.id,
      name: `${savedUser.firstName} ${savedUser.lastName}`.trim(),
      email: savedUser.email,
    };
  }
}
