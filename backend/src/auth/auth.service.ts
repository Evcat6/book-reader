import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '@/user/user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from '@/user/dto/create-user.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { RedisExpirationTime, RedisKeyPrefix } from '@/common/enum';
import { randomBytes } from 'crypto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    @InjectQueue('auth')
    private readonly audioQueue: Queue
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
    const { email, id, username } = await this.usersService.create(user);
    await this.sendVerificationLink({ email, id, username });
    return await this.login({ password: user.password, email });
  }

  public async verify(token: string) {
    const cacheDataRaw = await this.cacheManager.get(`${RedisKeyPrefix.VERIFY_USER}:${token}`);
    if(!cacheDataRaw) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }

    const { id } = cacheDataRaw as { id: string };
    await this.usersService.verifyById(id);
  }

  public async logout(id: string): Promise<void> {
    await this.cacheManager.del(`${RedisKeyPrefix.USER_INFO}:${id}`);
  }

  public async createNewVerificationLink(id: string): Promise<void> {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }
    await this.sendVerificationLink({ id, email: user.email, username: user.username });
  }

  private async sendVerificationLink({id, email, username}: { id: string; email: string; username: string }) {
    const verificationToken = randomBytes(16).toString('hex');
    await this.cacheManager.set(`${RedisKeyPrefix.VERIFY_USER}:${verificationToken}`, { id }, RedisExpirationTime.ONE_DAY);
    await this.audioQueue.add('send-user-mail-verification', {
      email,
      username,
      verificationToken
    });
  }
}
