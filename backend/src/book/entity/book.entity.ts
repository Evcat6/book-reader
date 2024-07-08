import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { APP_GLOBAL_PREFIX } from '@/common/constant';
import { UserEntity } from '@/user/entity/user.entity';

import { CreateBookDto } from '../dto/create-book.dto';

export const GROUP_BOOK = 'group_book_details';
export const GROUP_ALL_BOOKS = 'group_all_books';
@Entity({ name: 'books' })
export class BookEntity {
  @PrimaryGeneratedColumn('uuid')
  @Expose({ groups: [GROUP_BOOK, GROUP_ALL_BOOKS] })
  public id: string;

  @Column({ type: 'varchar', nullable: false })
  @Expose({ groups: [GROUP_BOOK, GROUP_ALL_BOOKS] })
  public name: string;

  @Exclude()
  @ApiHideProperty()
  @Column({ type: 'varchar', nullable: false })
  public fileName: string;

  @Column({ type: 'int', nullable: false })
  @Expose({ groups: [GROUP_BOOK] })
  public size: number;

  @Column({ type: 'boolean', default: true })
  @Expose({ groups: [GROUP_BOOK] })
  public isPrivate: boolean;

  @Column({ type: 'varchar', nullable: false, name: 'previewLink' })
  @Expose({ groups: [GROUP_BOOK, GROUP_ALL_BOOKS] })
  public previewLink: string;

  @ApiProperty({ name: 'accessLink' })
  @Expose({ groups: [GROUP_BOOK] })
  public get accessLink(): string {
    return `${process.env.APP_URL}/${APP_GLOBAL_PREFIX}/books/file/${this.fileName}`;
  }

  @CreateDateColumn({ type: 'timestamp' })
  @Expose({ groups: [GROUP_BOOK, GROUP_ALL_BOOKS] })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @Expose({ groups: [GROUP_BOOK, GROUP_ALL_BOOKS] })
  public updatedAt: Date;

  @ApiHideProperty()
  @ManyToOne(() => UserEntity, (user) => user.books)
  @Exclude()
  public user: UserEntity;

  // Required to calculate views attribute
  @ManyToMany(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinTable({ name: 'books_views' })
  @ApiHideProperty()
  @Exclude()
  public userViews?: UserEntity[];

  // Required to calculate amount of users who added book to favorites
  @ManyToMany(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinTable({ name: 'books_added_to_favorites' })
  @ApiHideProperty()
  @Exclude()
  public userAddedToFavorites?: UserEntity[];

  @Expose({ groups: [GROUP_BOOK, GROUP_ALL_BOOKS], name: 'views' })
  public views: number;

  @Expose({ groups: [GROUP_BOOK, GROUP_ALL_BOOKS], name: 'addedToFavorites' })
  public addedToFavorites: number;

  @Expose({ groups: [GROUP_BOOK], name: 'uploadedBy' })
  @ApiProperty({ type: 'string' })
  public get uploadedBy(): string {
    return this.user.username;
  }

  public constructor(
    book?: CreateBookDto & {
      fileName: string;
      previewLink: string;
      views?: number;
    },
    user?: UserEntity
  ) {
    if (!book) {
      return;
    }
    this.fileName = book.fileName;
    this.isPrivate = book.isPrivate;
    this.name = book.name;
    this.size = book.file.size;
    this.user = user;
    this.previewLink = book.previewLink;
  }
}
