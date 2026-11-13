import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  SignInResponseSchema,
  UserResponseSchema,
  type SignInDto,
  type SignInResponseDto,
  type UserResponseDto,
} from '@meal-mate/schemas';
import { Repository } from 'typeorm';
import { createAccessToken, getUserIdFromAuthorizationHeader } from './lib/access-token.js';
import { User } from '../users/entities/user.entity.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(data: SignInDto): Promise<SignInResponseDto> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: data.email })
      .getOne();

    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return SignInResponseSchema.parse({
      accessToken: await createAccessToken(this.jwtService, user.id),
      user: UserResponseSchema.parse(user),
    });
  }

  async me(authorizationHeader?: string): Promise<UserResponseDto> {
    const userId = await getUserIdFromAuthorizationHeader(
      this.jwtService,
      authorizationHeader,
    );
    const user = await this.usersRepository.findOneBy({ id: userId });

    if (!user) {
      throw new UnauthorizedException('User for this access token was not found');
    }

    return UserResponseSchema.parse(user);
  }
}
