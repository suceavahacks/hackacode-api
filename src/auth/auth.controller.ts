import { Controller, Get, Post, Body, Query, Redirect } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { GoogleAuthDto, GoogleCallbackDto } from './dto/google-auth.dto';
import { GetUser } from './decorators/get-user.decorator';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiSecure } from './decorators/api-secure.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @ApiOperation({ summary: 'Sign in a user' })
  @ApiResponse({ status: 200, description: 'User signed in successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Post('signup')
  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto.email, signUpDto.password);
  }

  @Post('signout')
  @ApiSecure()
  @ApiOperation({ summary: 'Sign out a user' })
  @ApiResponse({ status: 200, description: 'User signed out successfully' })
  signOut() {
    return this.authService.signOut();
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh the authentication token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  @Get('user')
  @ApiSecure()
  @ApiOperation({ summary: 'Get current user information' })
  @ApiResponse({ status: 200, description: 'Returns the current user' })
  getUser() {
    return this.authService.getUser();
  }

  @Post('google')
  @ApiOperation({ summary: 'Initiate Google OAuth authentication flow' })
  @ApiResponse({ status: 200, description: 'OAuth flow initiated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  initiateGoogleAuth() {
    return this.authService.initiateGoogleAuth();
  }

  @Get('google/callback')
  @ApiOperation({ summary: 'Handle Google OAuth callback' })
  @ApiResponse({ status: 200, description: 'Authentication successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  handleGoogleCallback(
    @Query('code') code: string,
    @Query('state') state: string,
  ) {
    return this.authService.handleGoogleCallback(code, state);
  }
}

