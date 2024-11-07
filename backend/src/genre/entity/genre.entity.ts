import { BookEntity } from '@/book/entity/book.entity';
import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity({ name: 'genres' })
export class GenreEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar', nullable: false })
  public name: string;

  @ApiHideProperty()
  @ManyToMany(() => BookEntity)
  @JoinTable({ name: 'book_genres' })
  @Exclude()
  public bookGenres?: BookEntity[];

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt: Date;

  @ManyToMany(() => BookEntity, (book) => book.genres)
  books: BookEntity[];

  public constructor(genre: { name: string }) {
    if (!genre) {
      return;
    }
    this.name = genre.name;
  }
}
