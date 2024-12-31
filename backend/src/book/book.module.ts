import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MinioClientModule } from '@/minio-client/minio-client.module';
import { UserEntity } from '@/user/entity/user.entity';

import { BookController } from './book.controller';
import { BookService } from './book.service';
import { BookEntity } from './entity/book.entity';
import { GenreEntity } from '@/genre/entity/genre.entity';
import { NotificationService } from '@/notification/notification.service';
import { NotificationEntity } from '@/notification/entity/notification.entity';

@Module({
  imports: [
    MinioClientModule,
    TypeOrmModule.forFeature([BookEntity, UserEntity, GenreEntity, NotificationEntity]),
  ],
  controllers: [BookController],
  providers: [BookService, NotificationService],
  exports: [BookService],
})
export class BookModule {}
