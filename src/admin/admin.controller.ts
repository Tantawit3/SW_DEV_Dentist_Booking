

import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AdminService } from './admin.service';
import { CreateDentistDto } from './dto/create-dentist.dto';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // @Roles(Role.Admin)
  @Post('dentist')
  async createDentist(@Body() createDentistDto: CreateDentistDto) {
    await this.adminService.createDentist(createDentistDto);
    return true;
  }
}
