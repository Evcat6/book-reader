import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, OneToMany } from 'typeorm';

import { CreateUserDto } from '../dto/create-user.dto';
import { BookEntity } from '@/book/entity/book.entity';
import { ApiHideProperty } from '@nestjs/swagger';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  username: string;

  @Exclude()
  @ApiHideProperty()
  @Column({ nullable: true })
  password: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ApiHideProperty()
  @OneToMany(() => BookEntity, (book) => book.user)
  books: BookEntity[];

  constructor(user?: CreateUserDto) {
    if (!user) return;
    this.email = user.email;
    this.username = user.username;
  }
}
