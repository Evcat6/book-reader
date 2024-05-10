import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entity/user.entity';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { RedisExpirationTime, RedisKeyPrefix } from '@/common/enum';
import { Cron } from '@nestjs/schedule';
import { AppLogger } from '@/common/service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private logger: AppLogger,
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
    const createdUser = await this.usersRepository.save(user);

    return createdUser;
  }

  private async findBy(payload: Partial<UserEntity>) {
    const user = await this.usersRepository.findOneBy(payload);
    if (!user) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  public async findById(id: string) {
    const userFromCache = await this.cacheManager.get(`${RedisKeyPrefix}:${id}`);

    if(userFromCache) return plainToInstance(UserEntity, userFromCache);

    const user = await this.findBy({ id });
    await this.cacheManager.set(`${RedisKeyPrefix.USER_INFO}:${id}`, instanceToPlain(user));
    return user;
  }

  public async verifyById(id: string) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }
    if (user.verified) {
      throw new HttpException('Already activated', HttpStatus.BAD_REQUEST);
    }
    user.verified = true;
    this.usersRepository.save(user);
  }

  public async findByEmail(email: string) {
    return await this.findBy({ email });
  }

  public async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOneBy({ id });

    if (updateUserDto.username) {
      user.username = updateUserDto.username;
    }

    const updatedUser = await this.usersRepository.save(user);
    await this.cacheManager.set(`${RedisKeyPrefix.USER_INFO}:${id}`, JSON.stringify(updatedUser), RedisExpirationTime.ONE_DAY);
    return updatedUser;
  }

  public async delete(id: string): Promise<boolean> {
    const result = await this.usersRepository.delete({ id });
    await this.cacheManager.del(`${RedisKeyPrefix.USER_INFO}:${id}`);
    return result.affected > 0;
  }

  @Cron('0 0 * * * *')
  async checkUnverifiedUsers() {
    this.logger.log('Unverified users deletion Cron Job started');
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

    const deletedUsers = await this.usersRepository
      .createQueryBuilder('users')
      .where('users."createdAt" <= :fiveDaysAgo', { fiveDaysAgo })
      .andWhere("users.verified = :verified", { verified: false })
      .delete()
      .execute();

    this.logger.log(`Unverified users deletion Cron Job done, deleted ${deletedUsers.affected} records`);
  }
}
