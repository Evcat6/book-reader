import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MinioClientModule } from '@/minio-client/minio-client.module';
import { UserEntity } from '@/user/entity/user.entity';

import { BookController } from './book.controller';
import { BookService } from './book.service';
import { BookEntity } from './entity/book.entity';
import { GenreEntity } from '@/genre/entity/genre.entity';

@Module({
  imports: [
    MinioClientModule,
    TypeOrmModule.forFeature([BookEntity, UserEntity, GenreEntity]),
  ],
  controllers: [BookController],
  providers: [BookService],
  exports: [BookService],
})
export class BookModule {}
