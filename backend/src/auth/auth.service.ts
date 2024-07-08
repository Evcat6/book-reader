import { randomBytes } from 'node:crypto';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';
import { Cache } from 'cache-manager';

import { BookEntity } from '@/book/entity/book.entity';
import { RedisExpirationTime, RedisKeyPrefix } from '@/common/enum';
import { AppLogger } from '@/common/service';
import { EMAIL_VERIFICATION_TOPIC } from '@/kafka/constant/kafka.constant';
import { KafkaService } from '@/kafka/kafka.service';
import { CreateUserDto } from '@/user/dto/create-user.dto';
import { UserService } from '@/user/user.service';

import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  public constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly kafkaService: KafkaService,
    private readonly logger: AppLogger,
    private readonly mailerService: MailerService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache
  ) {}

  private async validate(
    email: string,
    password: string
  ): Promise<{
    id: string;
    email: string;
    username: string;
    verified: boolean;
    createdAt: Date;
    updatedAt: Date;
    books: BookEntity[];
    bookViews?: BookEntity[];
    bookSaves?: BookEntity[];
  }> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
  }

  public async login(user: LoginUserDto): Promise<{
    accessToken: string;
  }> {
    const userEntity = await this.validate(user.email, user.password);
    const payload = { email: userEntity.email, sub: userEntity.id };
    const accessToken = this.jwtService.sign(payload);
    await this.cacheManager.set(
      `${RedisKeyPrefix.USER_INFO}:${userEntity.id}`,
      JSON.stringify(userEntity),
      RedisExpirationTime.ONE_DAY
    );
    return { accessToken };
  }

  public async register(user: CreateUserDto): Promise<{
    accessToken: string;
  }> {
    const { email, id, username } = await this.usersService.create(user);
    await this.sendVerificationLink({ email, id, username });
    return await this.login({ password: user.password, email });
  }

  public async verify(token: string): Promise<void> {
    const cacheDataRaw = await this.cacheManager.get(
      `${RedisKeyPrefix.VERIFY_USER}:${token}`
    );
    if (!cacheDataRaw) {
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
    await this.sendVerificationLink({
      id,
      email: user.email,
      username: user.username,
    });
  }

  private async sendVerificationLink({
    id,
    email,
    username,
  }: {
    id: string;
    email: string;
    username: string;
  }): Promise<void> {
    const verificationToken = randomBytes(16).toString('hex');
    await this.cacheManager.set(
      `${RedisKeyPrefix.VERIFY_USER}:${verificationToken}`,
      { id },
      RedisExpirationTime.ONE_DAY
    );
    this.kafkaService.sendMessage(EMAIL_VERIFICATION_TOPIC, {
      email,
      username,
      verificationToken,
    });
  }

  public async handleUserMailVerification(payload: {
    email: string;
    username: string;
    verificationToken: string;
  }): Promise<void> {
    this.logger.log(`Start handling email verification for ${payload.email}`);

    await this.mailerService.sendMail({
      to: payload.email,
      from: `Welcome to BookReader <${process.env.GMAIL_USER}>`,
      subject: 'Verify your email',
      text: '',
      template: 'email-verification',
      context: {
        name: payload.username,
        activationLink: `${process.env.APP_URL}/auth/verify/${payload.verificationToken}`,
      },
    });
    this.logger.log(`Verification email sent to ${payload.email}`);
  }
}
