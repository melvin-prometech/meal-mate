import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import {
  SignInSchema,
  type SignInDto,
  type SignInResponseDto,
  type UserResponseDto,
} from '@meal-mate/schemas';
import { AuthService } from './auth.service.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in and receive an access token' })
  @ApiOkResponse({ description: 'Credentials accepted; an access token was issued.' })
  @ApiUnauthorizedResponse({ description: 'Email or password is incorrect.' })
  signIn(
    @Body({ schema: SignInSchema }) data: SignInDto,
  ): Promise<SignInResponseDto> {
    return this.authService.signIn(data);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get the user represented by a Bearer access token' })
  @ApiOkResponse({ description: 'Current user returned.' })
  @ApiUnauthorizedResponse({ description: 'Bearer token is missing, invalid, or expired.' })
  me(@Headers('authorization') authorizationHeader?: string): Promise<UserResponseDto> {
    return this.authService.me(authorizationHeader);
  }
}
