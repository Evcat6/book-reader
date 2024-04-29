import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { CreateBookDto } from '../dto/create-book.dto';
import { UserEntity } from '@/user/entity/user.entity';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { APP_GLOBAL_PREFIX } from '@/common/constant';

export const GROUP_BOOK = 'group_book_details';
export const GROUP_ALL_BOOKS = 'group_all_books';

@Entity({ name: 'books' })
export class BookEntity {
  @PrimaryGeneratedColumn('uuid')
  @Expose({ groups: [GROUP_BOOK, GROUP_ALL_BOOKS] })
  id: string;

  @Column({ type: 'varchar', nullable: false })
  @Expose({ groups: [GROUP_BOOK, GROUP_ALL_BOOKS] })
  name: string;

  @Exclude()
  @ApiHideProperty()
  @Column({ type: 'varchar', nullable: false })
  fileName: string;

  @Column({ type: 'int', nullable: false })
  @Expose({ groups: [GROUP_BOOK] })
  size: number;

  @Column({ type: 'boolean', default: true })
  @Expose({ groups: [GROUP_BOOK] })
  isPrivate: boolean;

  @Column({ type: 'varchar', nullable: false, name: 'previewLink' })
  @Expose({ groups: [GROUP_BOOK, GROUP_ALL_BOOKS] })
  previewLink: string;

  @ApiProperty({ name: 'accessLink' })
  @Expose({ groups: [GROUP_BOOK] })
  get accessLink(): string {
    return `${process.env.APP_URL}/${APP_GLOBAL_PREFIX}/books/file/${this.fileName}`;
  }

  @CreateDateColumn({ type: 'timestamp' })
  @Expose({ groups: [GROUP_BOOK, GROUP_ALL_BOOKS] })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @Expose({ groups: [GROUP_BOOK, GROUP_ALL_BOOKS] })
  updatedAt: Date;

  @ApiHideProperty()
  @ManyToOne(() => UserEntity, (user) => user.books)
  user: UserEntity;

  // Required to calculate views attribute
  @ManyToMany(() => UserEntity)
  @JoinTable({ name: 'books_views' })
  @ApiHideProperty()
  @Exclude()
  bookUsersViews?: UserEntity[];

  @ManyToMany(() => UserEntity)
  @JoinTable({ name: 'books_savings' })
  @ApiHideProperty()
  @Exclude()
  bookUsersSaves?: UserEntity[];

  @Expose({ groups: [GROUP_BOOK, GROUP_ALL_BOOKS], name: 'views' })
  views: number;

  @Expose({ groups: [GROUP_BOOK], name: 'uploadedBy' })
  @ApiProperty({ type: 'string' })
  get uploadedBy() {
    return this.user.username;
  }

  constructor(
    book?: CreateBookDto & {
      fileName: string;
      previewLink: string;
      views?: number;
    },
    user?: UserEntity,
  ) {
    if (!book) return;
    this.fileName = book.fileName;
    this.isPrivate = book.isPrivate;
    this.name = book.name;
    this.size = book.file.size;
    this.user = user;
    this.previewLink = book.previewLink;
  }
}
