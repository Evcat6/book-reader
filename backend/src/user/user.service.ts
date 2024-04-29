import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { instanceToInstance } from 'class-transformer';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
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
    const user = await this.findBy({ id });
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

    return await this.usersRepository.save(user);
  }

  public async delete(id: string): Promise<boolean> {
    const result = await this.usersRepository.delete({ id });
    return result.affected > 0;
  }
}
