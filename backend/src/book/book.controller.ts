import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Query,
  SerializeOptions,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '@/auth/guard/auth.guard';
import { BooksOptionsDto } from '@/book/dto/books-options.dto';
import { Public, User } from '@/common/decorator';
import { PageDto } from '@/common/dto';
import { BufferedFile } from '@/minio-client/model';

import { BookService } from './book.service';
import { BookEntity, GROUP_ALL_BOOKS, GROUP_BOOK } from './entity/book.entity';

@Controller('books')
@ApiTags('Books')
@UseGuards(AuthGuard)
export class BookController {
  public constructor(private readonly bookService: BookService) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(FileInterceptor('file'))
  public async create(
    @User('sub') id: string,
    @Body('name') name: string,
    @Body('isPrivate') isPrivate: boolean,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 25 * 1024 * 1024 }), // MB * Kb * B
          new FileTypeValidator({ fileType: 'pdf' }),
        ],
      })
    )
    file: BufferedFile
  ): Promise<void> {
    return await this.bookService.create(id, { name, file, isPrivate });
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @SerializeOptions({
    groups: [GROUP_ALL_BOOKS],
  })
  public async getMany(
    @Query() booksRequestDto: BooksOptionsDto,
    @User('sub') userId: string
  ): Promise<PageDto<BookEntity>> {
    return await this.bookService.getMany(userId, booksRequestDto);
  }

  @Get('popular')
  @ApiBearerAuth('JWT-auth')
  @SerializeOptions({
    groups: [GROUP_ALL_BOOKS],
  })
  public async getPopular(): Promise<BookEntity[]> {
    return await this.bookService.getPopular();
  }

  @Get(':id')
  @SerializeOptions({
    groups: [GROUP_BOOK],
  })
  @ApiBearerAuth('JWT-auth')
  public async getOne(
    @Param('id') bookId: string,
    @User('sub') userId: string
  ): Promise<BookEntity> {
    return await this.bookService.getOne(userId, bookId);
  }

  @Post('send-view/:id')
  @ApiBearerAuth('JWT-auth')
  public async sendView(
    @User('sub') userId: string,
    @Param('id') bookId: string
  ): Promise<void> {
    await this.bookService.sendView(userId, bookId);
  }

  @Get('file/:id')
  @Public()
  public async getFile(@Param('id') bookId: string): Promise<StreamableFile> {
    const file = await this.bookService.getDownloadFile(bookId);
    return new StreamableFile(file);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  public async deleteById(
    @User('sub') userId: string,
    @Param('id') bookId: string
  ): Promise<boolean> {
    return await this.bookService.removeById(userId, bookId);
  }
}
