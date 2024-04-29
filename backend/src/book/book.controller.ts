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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@/auth/guard/auth.guard';
import { Public, User } from '@/common/decorator';

import { BookService } from './book.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { BooksOptionsDto } from '@/book/dto/books-options.dto';
import { BufferedFile } from '@/minio-client/model';
import { GROUP_ALL_BOOKS, GROUP_BOOK } from './entity/book.entity';

@Controller('books')
@ApiTags('Books')
@UseGuards(AuthGuard)
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @User('sub') id: string,
    @Body('name') name: string,
    @Body('isPrivate') isPrivate: boolean,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 25 * 1024 * 1024 }), // MB * Kb * B
          new FileTypeValidator({ fileType: 'pdf' }),
        ],
      }),
    )
    file: BufferedFile,
  ) {
    return await this.bookService.create(id, { name, file, isPrivate });
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @SerializeOptions({
    groups: [GROUP_ALL_BOOKS],
  })
  async getMany(@Query() booksRequestDto: BooksOptionsDto, @User('sub') userId: string) {
    const response = await this.bookService.getMany(userId, booksRequestDto);
    return response;
  }

  @Get('popular')
  @ApiBearerAuth('JWT-auth')
  @SerializeOptions({
    groups: [GROUP_ALL_BOOKS],
  })
  async getPopular() {
    const response = await this.bookService.getPopular();
    return response;
  }

  @Get(':id')
  @SerializeOptions({
    groups: [GROUP_BOOK],
  })
  @ApiBearerAuth('JWT-auth')
  async getOne(@Param('id') bookId: string, @User('sub') userId: string) {
    const response = await this.bookService.getOne(userId, bookId);
    return response;
  }

  @Post('send-view/:id')
  @ApiBearerAuth('JWT-auth')
  async sendView(@User('sub') userId: string, @Param('id') bookId: string) {
    await this.bookService.sendView(userId, bookId);
  }

  @Get('file/:id')
  @Public()
  async getFile(@Param('id') bookId: string) {
    const file = await this.bookService.getDownloadFile(bookId);
    return new StreamableFile(file);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  async deleteById(@User('sub') userId: string, @Param('id') bookId: string) {
    return await this.bookService.removeById(userId, bookId);
  }
}
