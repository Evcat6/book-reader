import { Body, Controller, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public, User } from '@/common/decorator';
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

  @Public()
  @Post('verify/:token')
  @HttpCode(200)
  async verify(@Param('token') token: string) {
    return await this.authService.verify(token);
  }

  @Post('new-verification-link')
  async createVerificationToken(@User() user) {
    return await this.authService.createNewVerificationLink(user.id);
  }

  @Post('logout')
  async logout(@User() user) {
    await this.authService.logout(user.id);
  }
}
