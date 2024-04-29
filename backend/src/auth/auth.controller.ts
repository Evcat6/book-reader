import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '@/common/decorator';
import { CreateUserDto } from '@/user/dto/create-user.dto';
import { UserService } from '@/user/user.service';

import { AuthService } from './auth.service';
import { LoginUserResponseDto } from './dto/login-user-response.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from './guard/auth.guard';

@Controller('auth')
@ApiTags('Auth')
@UseGuards(AuthGuard)
export class AuthController {
  constructor(private authService: AuthService, private usersService: UserService) {}

  @Public()
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({ type: LoginUserResponseDto })
  @Post('login')
  async login(@Body() user: LoginUserDto) {
    return await this.authService.login(user);
  }

  @Public()
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ type: LoginUserResponseDto })
  @HttpCode(200)
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }
}
