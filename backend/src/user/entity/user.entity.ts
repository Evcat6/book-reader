import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, OneToMany, ManyToMany } from 'typeorm';

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

  @Column({ nullable: false, default: false })
  verified: boolean;

  @CreateDateColumn({ type: 'timestamp', name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ApiHideProperty()
  @OneToMany(() => BookEntity, (book) => book.user)
  books: BookEntity[];

  @ApiHideProperty()
  @ManyToMany(() => UserEntity, user => user.bookViews, { onDelete: 'CASCADE' })
  bookViews: UserEntity[];

  @ApiHideProperty()
  @ManyToMany(() => UserEntity, user => user.bookSaves, { onDelete: 'CASCADE' })
  bookSaves: UserEntity[];

  constructor(user?: CreateUserDto) {
    if (!user) return;
    this.email = user.email;
    this.username = user.username;
  }
}
