import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
// import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { instanceToInstance } from 'class-transformer';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entity/user.entity';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { RedisExpirationTime, RedisKeyPrefix } from '@/common/enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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

    return instanceToInstance(createdUser);
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

    if(userFromCache) return userFromCache;

    const user = await this.findBy({ id });
    await this.cacheManager.set(`${RedisKeyPrefix.USER_INFO}:${id}`, JSON.stringify(user));
    return instanceToInstance(user);
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
}
