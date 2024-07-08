import type { Cache } from '@nestjs/cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import type { Repository } from 'typeorm';

import { BookEntity } from '@/book/entity/book.entity';
import { RedisExpirationTime, RedisKeyPrefix } from '@/common/enum';
import type { AppLogger } from '@/common/service';

import type { CreateUserDto } from './dto/create-user.dto';
import type { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entity/user.entity';

@Injectable()
export class UserService {
  public constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private logger: AppLogger
  ) {}

  public async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    }

    const user = new UserEntity(createUserDto);
    user.password = await bcrypt.hash(createUserDto.password, 10);
    return await this.usersRepository.save(user);
  }

  private async findBy(payload: Partial<UserEntity>): Promise<UserEntity> {
    const user = await this.usersRepository.findOneBy(payload);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  public async findById(id: string): Promise<UserEntity> {
    const userFromCache = await this.cacheManager.get(
      `${RedisKeyPrefix.USER_INFO}:${id}`
    );

    if (userFromCache) {
      return plainToInstance(UserEntity, userFromCache);
    }

    const user = await this.findBy({ id });
    await this.cacheManager.set(
      `${RedisKeyPrefix.USER_INFO}:${id}`,
      instanceToPlain(user)
    );
    return user;
  }

  public async addBookToFavorites(
    userId: string,
    bookId: string
  ): Promise<void> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }
    const book = await this.bookRepository.findOneBy({ id: bookId });
    user.bookSaves.push(book);

    await this.usersRepository.save(user);
  }

  public async verifyById(id: string): Promise<void> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }
    if (user.verified) {
      throw new HttpException('Already activated', HttpStatus.BAD_REQUEST);
    }
    user.verified = true;
    void this.usersRepository.save(user);
  }

  public async findByEmail(email: string): Promise<UserEntity> {
    return await this.findBy({ email });
  }

  public async update(
    id: string,
    updateUserDto: UpdateUserDto
  ): Promise<UserEntity> {
    const user = await this.usersRepository.findOneBy({ id });

    if (updateUserDto.username) {
      user.username = updateUserDto.username;
    }

    const updatedUser = await this.usersRepository.save(user);
    await this.cacheManager.set(
      `${RedisKeyPrefix.USER_INFO}:${id}`,
      JSON.stringify(updatedUser),
      RedisExpirationTime.ONE_DAY
    );
    return updatedUser;
  }

  public async delete(id: string): Promise<boolean> {
    const result = await this.usersRepository.delete({ id });
    await this.cacheManager.del(`${RedisKeyPrefix.USER_INFO}:${id}`);
    return result.affected > 0;
  }

  @Cron('0 0 * * * *')
  public async checkUnverifiedUsers(): Promise<void> {
    this.logger.log('Unverified users deletion Cron Job started');
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

    const deletedUsers = await this.usersRepository
      .createQueryBuilder('users')
      .where('users."createdAt" <= :fiveDaysAgo', { fiveDaysAgo })
      .andWhere('users.verified = :verified', { verified: false })
      .delete()
      .execute();

    this.logger.log(
      `Unverified users deletion Cron Job done, deleted ${deletedUsers.affected} records`
    );
  }
}
