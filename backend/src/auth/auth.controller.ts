import {
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MessagePattern, Payload, Transport } from '@nestjs/microservices';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Public, User } from '@/common/decorator';
import { EMAIL_VERIFICATION_TOPIC } from '@/kafka/constant/kafka.constant';
import { CreateUserDto } from '@/user/dto/create-user.dto';
import type { UserService } from '@/user/user.service';

import type { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginUserResponseDto } from './dto/login-user-response.dto';
import { AuthGuard } from './guard/auth.guard';

@Controller('auth')
@ApiTags('Auth')
@UseGuards(AuthGuard)
export class AuthController {
  public constructor(
    private authService: AuthService,
    private usersService: UserService
  ) {}

  @Public()
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({ type: LoginUserResponseDto })
  @Post('login')
  public async login(@Body() user: LoginUserDto): Promise<{
    accessToken: string;
  }> {
    return await this.authService.login(user);
  }

  @Public()
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ type: LoginUserResponseDto })
  @HttpCode(200)
  @Post('register')
  public async register(@Body() createUserDto: CreateUserDto): Promise<{
    accessToken: string;
  }> {
    return await this.authService.register(createUserDto);
  }

  @Public()
  @Post('verify/:token')
  @HttpCode(200)
  public async verify(@Param('token') token: string): Promise<void> {
    return await this.authService.verify(token);
  }

  @Post('new-verification-link')
  public async createVerificationToken(@User() user): Promise<void> {
    return await this.authService.createNewVerificationLink(user.id);
  }

  @Post('logout')
  public async logout(@User() user): Promise<void> {
    await this.authService.logout(user.id);
  }

  @Public()
  @MessagePattern(EMAIL_VERIFICATION_TOPIC, Transport.KAFKA)
  public async emailVerification(
    @Payload()
    payload: {
      email: string;
      username: string;
      verificationToken: string;
    }
  ): Promise<void> {
    await this.authService.handleUserMailVerification(payload);
  }
}
