import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { pdftobuffer } from 'pdftopic';

import { BookEntity } from './entity/book.entity';
import { UserEntity } from '@/user/entity/user.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { PageDto, PageMetaDto } from '@/common/dto';
import { BooksOptionsDto } from '@/book/dto/books-options.dto';
import { MinioClientService } from '@/minio-client/minio-client.service';
import { BufferedFile } from '@/minio-client/model';
import { CloudinaryService } from 'nestjs-cloudinary';
import { UploadApiResponse } from 'cloudinary/types'; // Installed already with nestjs-cloudinary
import { QUERY_VIEWS_CACHE, TOP_BOOKS_COUNT } from './constant';
import { BOOKS_BUCKET_NAME } from '@/minio-client/constant';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private minioClientService: MinioClientService,
    private cloudinaryService: CloudinaryService,
  ) {}

  public async create(userId: string, { name, file, isPrivate }: CreateBookDto) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['books'],
    });
    const { fileName } = await this.minioClientService.upload(file, 'books');
    const previewImage = await this.extractFirstPageFromPdf(file);

    const uploadRes: UploadApiResponse = await new Promise((resolve) => {
      this.cloudinaryService.cloudinary.uploader
        .upload_stream((_error, uploadResult) => {
          return resolve(uploadResult);
        })
        .end(previewImage);
    });

    const newBook = new BookEntity({ name, file, isPrivate, fileName, previewLink: uploadRes.secure_url }, user);
    await this.bookRepository.save(newBook);
  }

  public async getAllByUserId(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    return user.books;
  }

  public async removeById(userId: string, bookId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const bookToRemove = user.books.find((book) => book.id === bookId);
    const result = await this.bookRepository.delete(bookToRemove);
    return result.affected > 0;
  }

  public async getMany(userId: string, pageOptionsDto: BooksOptionsDto): Promise<PageDto<BookEntity>> {
    const queryBuilder = this.bookRepository.createQueryBuilder('books');

    const whereOptions: { [key: string]: any } = { isPrivate: false };

    if (pageOptionsDto.searchQuery) {
      whereOptions.name = Like(`%${pageOptionsDto.searchQuery}%`);
    }

    if (pageOptionsDto.userOwned) {
      whereOptions.user = { id: userId };
    }

    queryBuilder
      .loadRelationCountAndMap('book.views', 'books.userViews', 'views')
      .orderBy('books.createdAt', pageOptionsDto.order)
      .where(whereOptions)
      .cache(QUERY_VIEWS_CACHE)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const [entities, itemCount] = await queryBuilder.getManyAndCount();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  public async getOne(userId: string, bookId: string) {
    const queryBuilder = this.bookRepository.createQueryBuilder('books');
    const book = await queryBuilder
      .where({ id: bookId })
      .loadRelationCountAndMap('book.views', 'books.userViews', 'views')
      .leftJoinAndSelect('books.user', 'user')
      .getOne();
    if (!book) {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    }

    if (book.isPrivate && book.user.id !== userId) {
      throw new HttpException('Bad Request', HttpStatus.FORBIDDEN);
    }

    return book;
  }

  public async getDownloadFile(objectName: string) {
    const bookFile = await this.minioClientService.get(BOOKS_BUCKET_NAME, objectName);
    return bookFile;
  }

  public async getPopular() {
    const queryBuilder = this.bookRepository.createQueryBuilder('books');
    const books = await queryBuilder
      .where({ isPrivate: false })
      .loadRelationCountAndMap('books.views', 'books.userViews', 'views')
      .addSelect((query) => {
        return query
          .select('COUNT(books_views.usersId)', 'count')
          .from('books_views', 'books_views')
          .where('books_views.booksId = books.id');
      }, 'views_sortable')
      .addOrderBy('views_sortable', 'DESC')
      .limit(TOP_BOOKS_COUNT)
      .cache(QUERY_VIEWS_CACHE)
      .getMany();

    return books;
  }

  public async sendView(userId: string, bookId: string) {
    const book = await this.bookRepository.findOne({
      where: { id: bookId },
      relations: ['bookUsersViews'],
    });

    if (!book) {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    book.userViews.push(user);

    await this.bookRepository.save(book);
  }

  private async extractFirstPageFromPdf(bufferedFile: BufferedFile) {
    const [image] = await pdftobuffer(bufferedFile.buffer as Buffer, 0);
    return image;
  }
}
