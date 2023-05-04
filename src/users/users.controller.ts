import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Public } from '../auth/public_decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Create a user in register page
   */
  @ApiResponse({
    status: 201,
    description: 'Return all users in the database',
    type: String,
  })
  @ApiQuery({
    name: 'token',
    required: false,
    type: String,
  })
  @Public()
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<boolean> {
    const createdUser = await this.usersService.create(createUserDto);
    return true;
  }

  /**
   * Get user profile
   */
  @Get('profile')
  async getProfile(@Req() req) {
    return await this.usersService.getProfile(req.user.username);
  }

  @Get('dentist')
  async getDentist() {
    return await this.usersService.getDentist();
  }
}
