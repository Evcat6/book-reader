import { Body, Controller, Delete, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@/auth/guard/auth.guard';
import { User } from '@/common/decorator';

import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('Users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Patch('me')
  @ApiBearerAuth('JWT-auth')
  async updateMe(@User('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete('me')
  @ApiBearerAuth('JWT-auth')
  async deleteMe(@User('id') id: string) {
    return await this.usersService.delete(id);
  }

  @Get('me')
  @ApiBearerAuth('JWT-auth')
  loadUser(@User() user) {
    return this.usersService.findById(user.id);
  }
}
