import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '@/auth/guard/auth.guard';
import { User } from '@/common/decorator';

import type { UpdateUserDto } from './dto/update-user.dto';
import type { UserEntity } from './entity/user.entity';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('Users')
@UseGuards(AuthGuard)
export class UserController {
  public constructor(private readonly usersService: UserService) {}

  @Patch('me')
  @ApiBearerAuth('JWT-auth')
  public async updateMe(
    @User('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<UserEntity> {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete('me')
  @ApiBearerAuth('JWT-auth')
  public async deleteMe(@User('id') id: string): Promise<boolean> {
    return await this.usersService.delete(id);
  }

  @Get('me')
  @ApiBearerAuth('JWT-auth')
  public async loadUser(@User() user): Promise<UserEntity> {
    return await this.usersService.findById(user.id);
  }
}
