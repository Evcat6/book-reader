import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BookEntity } from './entity/book.entity';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { UserEntity } from '@/user/entity/user.entity';
import { MinioClientModule } from '@/minio-client/minio-client.module';

@Module({
  imports: [MinioClientModule, TypeOrmModule.forFeature([BookEntity, UserEntity])],
  controllers: [BookController],
  providers: [BookService],
  exports: [BookService],
})
export class BookModule {}
