import { Controller, Get } from '@nestjs/common';
import { Post, Request, UseGuards } from '@nestjs/common';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';

import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { Public } from './auth/public_decorator';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiResponse({ status: 201, description: 'return access token' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Public()
  @UseGuards(LocalAuthGuard)
  @ApiQuery({
    name: 'password',
    type: 'string',
    required: true,
    example: '123456aA',
  })
  @ApiQuery({
    name: 'username',
    type: 'string',
    required: true,
    example: 'lungtuu',
  })
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user._doc);
  }
}
