import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { BookEntity } from '@/book/entity/book.entity';

import type { CreateUserDto } from '../dto/create-user.dto';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ unique: true })
  public email: string;

  @Column()
  public username: string;

  @Exclude()
  @ApiHideProperty()
  @Column({ nullable: true })
  public password: string;

  @Column({ nullable: false, default: false })
  public verified: boolean;

  @Column({ nullable: true })
  public avatarUrl?: string;

  @CreateDateColumn({ type: 'timestamp', name: 'createdAt' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt: Date;

  @ApiHideProperty()
  @OneToMany(() => BookEntity, (book) => book.user, { onDelete: "CASCADE" })
  public books: BookEntity[];

  @ApiHideProperty()
  @ManyToMany(() => BookEntity)
  @JoinTable({ name: 'books_views' })
  @Exclude()
  public bookViews?: BookEntity[];

  @ApiHideProperty()
  @ManyToMany(() => BookEntity)
  @JoinTable({ name: 'books_added_to_favorites' })
  @Exclude()
  public bookSaves?: BookEntity[];

  public constructor(user?: CreateUserDto) {
    if (!user) {
      return;
    }
    this.email = user.email;
    this.username = user.username;
  }
}
