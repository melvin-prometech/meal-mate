import { Injectable } from '@nestjs/common';
import type {
  CreateUserDto,
  UserResponseDto,
} from '@meal-mate/schemas';

@Injectable()
export class UserService {
  create(data: CreateUserDto): UserResponseDto {
    return {
      id: 'user-123',
      name: data.name,
      email: data.email,
    };
  }
}