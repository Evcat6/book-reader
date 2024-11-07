import type internal from 'node:stream';

import { BadRequestException, HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isBoolean } from 'class-validator';
import type { UploadApiResponse } from 'cloudinary/types'; // Installed already with nestjs-cloudinary
import { CloudinaryService } from 'nestjs-cloudinary';
import { pdftobuffer } from 'pdftopic';
import { Repository } from 'typeorm';
import { Like } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

import type { BooksOptionsDto } from '@/book/dto/books-options.dto';
import { PageDto, PageMetaDto } from '@/common/dto';
import { BOOKS_BUCKET_NAME } from '@/minio-client/constant';
import { MinioClientService } from '@/minio-client/minio-client.service';
import type { BufferedFile } from '@/minio-client/model';
import { UserEntity } from '@/user/entity/user.entity';

import { QUERY_VIEWS_CACHE, TOP_BOOKS_COUNT } from './constant';
import type { CreateBookRequestDto } from './dto/create-book-request.dto';
import { BookEntity } from './entity/book.entity';
import { GenreEntity } from '@/genre/entity/genre.entity';
import { Cache } from '@nestjs/cache-manager';
import { RedisKeyPrefix } from '@/common/enum';

@Injectable()
export class BookService {
  public constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly minioClientService: MinioClientService,
    private readonly cloudinaryService: CloudinaryService,
    @InjectRepository(GenreEntity)
    private readonly genreRepository: Repository<GenreEntity>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) { }

  public async create(
    userId: string,
    { name, file, isPrivate, genresIds  }: CreateBookRequestDto
  ): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    const { fileName } = await this.minioClientService.upload(file, 'books');
    const previewImage = await this.extractFirstPageFromPdf(file);

    const uploadResult: UploadApiResponse = await new Promise((resolve) => {
      this.cloudinaryService.cloudinary.uploader
        .upload_stream((_error, uploadResult) => {
          return resolve(uploadResult);
        })
        .end(previewImage);
    });
    const genres = await Promise.all(genresIds?.map((genreId) => this.genreRepository.findOneBy({ id: genreId })) || []);

    const newBook = new BookEntity(
      { name, file, isPrivate, fileName, previewLink: uploadResult.secure_url },
      user,
      genres
    );
    await this.bookRepository.save(newBook);
  }

  public async getAllByUserId(userId: string): Promise<BookEntity[]> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    return user.books;
  }

  public async removeById(userId: string, bookId: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const bookToRemove = user.books.find((book) => book.id === bookId);
    const result = await this.bookRepository.delete(bookToRemove);
    return result.affected > 0;
  }

  public async getMany(
    userId: string,
    pageOptionsDto: BooksOptionsDto
  ): Promise<PageDto<BookEntity>> {
    const queryBuilder = this.bookRepository.createQueryBuilder('books');

    const whereOptions: { [key: string]: unknown } = { isPrivate: false };

    if (pageOptionsDto.searchQuery) {
      whereOptions.name = Like(`%${pageOptionsDto.searchQuery}%`);
    }

    if (isBoolean(pageOptionsDto.userOwned)) {
      whereOptions.user = { id: userId };
    }
    /* eslint-disable sonarjs/no-duplicate-string */
    queryBuilder
      .loadRelationCountAndMap('book.views', 'books.userViews', 'views')
      .loadRelationCountAndMap(
        'books.addedToFavorites',
        'books.userAddedToFavorites',
        'addedToFavorites',
      )
      .orderBy('books.createdAt', pageOptionsDto.order)
      .where(whereOptions)
      .cache(QUERY_VIEWS_CACHE)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);
    /* eslint-enable sonarjs/no-duplicate-string */
    const [entities, itemCount] = await queryBuilder.getManyAndCount();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  public async getOne(userId: string, bookId: string): Promise<BookEntity> {
    const queryBuilder = this.bookRepository.createQueryBuilder('books');
    const isViewed = await this.cacheManager.get(`${RedisKeyPrefix.USER_INFO}:${bookId}:${userId}`);

    queryBuilder
      .where({ id: bookId })
      .loadRelationCountAndMap('book.views', 'books.userViews', 'views')
      .loadRelationCountAndMap(
        'books.addedToFavorites',
        'books.userAddedToFavorites',
        'addedToFavorites'
      )
      .leftJoinAndSelect('books.user', 'user')
      .leftJoinAndSelect('books.genres', 'genres')
      // .relation('genres')
    if (!isViewed) {
      queryBuilder
        .leftJoinAndSelect('books.userViews', 'userViews', "user.id = :userId", { userId });
    }
    await queryBuilder.getRawOne().then(console.log);
    const book = await queryBuilder.getOne();

    if (!book) {
      throw new NotFoundException();
    }

    if (book.isPrivate && book.user.id !== userId) {
      throw new BadRequestException();
    }

    if (!isViewed) {
      if(book.userViews.length > 0) {
        await this.cacheManager.set(`${RedisKeyPrefix.USER_INFO}:${bookId}:${userId}`, true);
      } else {
        await this.setView(book, userId);
      }
    }

    return book;
  }

  private async setView(book: BookEntity, userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    book.userViews.push(user);

    await this.bookRepository.save(book);

    await this.cacheManager.set(`${RedisKeyPrefix.USER_INFO}:${book.id}:${userId}`, true);
  }

  public async getDownloadFile(objectName: string): Promise<internal.Readable> {
    return await this.minioClientService.get(BOOKS_BUCKET_NAME, objectName);
  }

  public async getPopular(): Promise<BookEntity[]> {
    const queryBuilder = this.bookRepository.createQueryBuilder('books');
    return await queryBuilder
      .where({ isPrivate: false })
      .loadRelationCountAndMap('books.views', 'books.userViews', 'views')
      .loadRelationCountAndMap(
        'books.addedToFavorites',
        'books.userAddedToFavorites',
        'addedToFavorites'
      )
      .addSelect((query) => {
        return query
          .select('COUNT(books_views.usersId)', 'count')
          .from('books_views', 'books_views')
          .where('books_views.booksId = books.id');
      }, 'views_sortable')
      .addSelect((query) => {
        return query
          .select(
            'COUNT(books_added_to_favorites.usersId)',
            'added_to_favorites'
          )
          .from('books_added_to_favorites', 'books_added_to_favorites')
          .where('books_added_to_favorites.booksId = books.id');
      }, 'added_to_favorites_sortable')
      .addOrderBy('views_sortable', 'DESC')
      .addOrderBy('added_to_favorites_sortable', 'DESC')
      .limit(TOP_BOOKS_COUNT)
      .cache(QUERY_VIEWS_CACHE)
      .getMany();
  }

  // public async addToFavorites(userId: string, bookId: string) {
  //   const user = await this.userRepository.findOne({
  //     where: { id: userId },
  //     relations: ['bookSaves'],
  //   });

  //   if (!user) {
  //     throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  //   }

  //   const book = await this.bookRepository.findOne({ where: {} });
  // }

  private async extractFirstPageFromPdf(
    bufferedFile: BufferedFile
  ): Promise<Buffer> {
    const [image] = await pdftobuffer(bufferedFile.buffer as Buffer, 0);
    return image;
  }
}
