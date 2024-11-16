import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  UseGuards,
  Put,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '@/auth/guard/auth.guard';
import { User } from '@/common/decorator';

import type { UpdateUserDto } from './dto/update-user.dto';
import type { UserEntity } from './entity/user.entity';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
@ApiTags('Users')
@UseGuards(AuthGuard)
export class UserController {
  public constructor(private readonly usersService: UserService) { }

  @Patch('me')
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(FileInterceptor('file'))
  public async updateMe(
    @User('sub') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 30 * 1024 * 1024 }), // MB * Kb * B
          new FileTypeValidator({ fileType: /\/(jpg|jpeg|png|gif)$/ }),
        ],
        fileIsRequired: false
      })
    ) file: Express.Multer.File | undefined
  ): Promise<UserEntity> {
    return await this.usersService.update(id, updateUserDto, file);
  }

  @Delete('me')
  @ApiBearerAuth('JWT-auth')
  public async deleteMe(@User('sub') id: string): Promise<boolean> {
    return await this.usersService.delete(id);
  }

  @Get('me')
  @ApiBearerAuth('JWT-auth')
  public async loadUser(@User('sub') id: string): Promise<UserEntity> {
    return await this.usersService.findById(id);
  }
}
