import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiConflictResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  SignInSchema,
  SignUpSchema,
  type SignUpDto,
  type SignInDto,
  type SignInResponseDto,
  type UserResponseDto,
} from '@meal-mate/schemas';
import { AuthService } from './auth.service.js';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in and receive an access token' })
  @ApiOkResponse({
    description: 'Credentials accepted; an access token was issued.',
  })
  @ApiUnauthorizedResponse({ description: 'Email or password is incorrect.' })
  signIn(
    @Body({ schema: SignInSchema }) data: SignInDto,
  ): Promise<SignInResponseDto> {
    return this.authService.signIn(data);
  }

  @Post('sign-up')
  @ApiOperation({ summary: 'Create a default-role user account' })
  @ApiCreatedResponse({ description: 'Account created successfully.' })
  @ApiBadRequestResponse({ description: 'The request body is invalid.' })
  @ApiConflictResponse({ description: 'An account with this email already exists.' })
  signUp(
    @Body({ schema: SignUpSchema }) data: SignUpDto,
  ): Promise<UserResponseDto> {
    return this.authService.signUp(data);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get the user represented by a Bearer access token',
  })
  @ApiOkResponse({ description: 'Current user returned.' })
  @ApiUnauthorizedResponse({
    description: 'Bearer token is missing, invalid, or expired.',
  })
  me(
    @Headers('authorization') authorizationHeader?: string,
  ): Promise<UserResponseDto> {
    return this.authService.me(authorizationHeader);
  }
}
