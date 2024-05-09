import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '@/user/user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from '@/user/dto/create-user.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { RedisExpirationTime, RedisKeyPrefix } from '@/common/enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) { }

  private async validate(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
  }

  public async login(user: LoginUserDto) {
    const userEntity = await this.validate(user.email, user.password);
    const payload = { email: userEntity.email, sub: userEntity.id };
    const accessToken = this.jwtService.sign(payload);
    await this.cacheManager.set(`${RedisKeyPrefix.USER_INFO}:${userEntity.id}`, JSON.stringify(userEntity), RedisExpirationTime.ONE_DAY);
    return { accessToken };
  }

  public async register(user: CreateUserDto) {
    const { email } = await this.usersService.create(user);
    return await this.login({ password: user.password, email: email });
  }

  public async logout(id: string): Promise<void> {
    await this.cacheManager.del(`${RedisKeyPrefix.USER_INFO}:${id}`);
  } 
}
